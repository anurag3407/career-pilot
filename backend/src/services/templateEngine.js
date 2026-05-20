import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Simple template engine for rendering email templates with variable substitution
 * Supports basic handlebars-like syntax without requiring external libraries
 */

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates', 'emails');

/**
 * Read and cache templates
 */
const templateCache = {};

/**
 * Load template from file
 */
const loadTemplate = (templateName) => {
  if (templateCache[templateName]) {
    return templateCache[templateName];
  }

  const templatePath = path.join(TEMPLATES_DIR, `${templateName}.html`);
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templateName}`);
  }

  const content = fs.readFileSync(templatePath, 'utf-8');
  templateCache[templateName] = content;
  return content;
};

/**
 * Simple helper for date formatting
 */
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

/**
 * Format currency in Indian Rupees
 */
const formatCurrency = (amount) => {
  if (!amount) return '0';
  return amount.toLocaleString('en-IN');
};

/**
 * Add days to current date
 */
const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + parseInt(days));
  return formatDate(date);
};

/**
 * Truncate text to specific length
 */
const truncate = (text, length = 200) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
};

/**
 * Escape HTML special characters
 */
const escapeHtml = (text) => {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const resolveValue = (key, context, data) => {
  if (context && typeof key === 'string') {
    const contextValue = getNestedValue(context, key);
    if (contextValue !== undefined) {
      return contextValue;
    }
  }

  return getNestedValue(data, key);
};

const parseOperand = (operand, context, data) => {
  if (/^\d+$/.test(operand)) {
    return Number(operand);
  }

  if (/^['"].*['"]$/.test(operand)) {
    return operand.slice(1, -1);
  }

  return resolveValue(operand, context, data);
};

const evaluateCondition = (condition, context, data) => {
  const expression = condition.trim();

  if (expression.startsWith('!')) {
    return !Boolean(resolveValue(expression.slice(1).trim(), context, data));
  }

  const operators = ['===', '!==', '>=', '<=', '==', '!=', '>', '<'];
  for (const operator of operators) {
    const parts = expression.split(operator);
    if (parts.length === 2) {
      const left = parseOperand(parts[0].trim(), context, data);
      const right = parseOperand(parts[1].trim(), context, data);

      switch (operator) {
        case '===': return left === right;
        case '!==': return left !== right;
        case '==': return left == right;
        case '!=': return left != right;
        case '>=': return left >= right;
        case '<=': return left <= right;
        case '>': return left > right;
        case '<': return left < right;
        default: return Boolean(left);
      }
    }
  }

  return Boolean(resolveValue(expression, context, data));
};

/**
 * Process conditional blocks: {{#if condition}}...{{else}}...{{/if}}
 */
const processConditionals = (template, data, context) => {
  return template.replace(/\{\{#if\s+([^\}]+)\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/if\}\}/g, (match, condition, truthy, falsey = '') => {
    const result = evaluateCondition(condition, context, data);
    return result ? truthy : falsey;
  });
};

const renderTemplateSegment = (template, data, context) => {
  let segment = processConditionals(template, data, context);
  segment = processLoops(segment, data, context);
  segment = processHelpers(segment, data, context);
  segment = processVariables(segment, data, context);
  return segment;
};

/**
 * Process each loops: {{#each array}}...{{/each}}
 */
const processLoops = (template, data, context) => {
  return template.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayName, content) => {
    const array = resolveValue(arrayName, context, data);
    if (!Array.isArray(array)) return '';
    
    return array.map((item, index) => {
      let loopContent = renderTemplateSegment(content, data, item);
      loopContent = loopContent.replace(/\{\{@index\}\}/g, index);
      return loopContent;
    }).join('');
  });
};

/**
 * Get nested object value using dot notation
 */
const getNestedValue = (obj, path) => {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
};

/**
 * Process helper functions: {{functionName value}}
 */
const processHelpers = (template, data, context) => {
  // Process formatCurrency helper
  template = template.replace(/\{\{formatCurrency\s+([\w\.]+)\}\}/g, (match, varName) => {
    const value = resolveValue(varName, context, data);
    return value ? formatCurrency(value) : '0';
  });

  // Process addDays helper
  template = template.replace(/\{\{addDays\s+([\w\.]+)\}\}/g, (match, varName) => {
    const value = resolveValue(varName, context, data);
    return value ? addDays(value) : '';
  });

  // Process truncate helper
  template = template.replace(/\{\{truncate\s+([\w\.]+)\s+(\d+)\}\}/g, (match, varName, length) => {
    const value = resolveValue(varName, context, data);
    return value ? truncate(value, parseInt(length)) : '';
  });

  // Process truncate without length argument
  template = template.replace(/\{\{truncate\s+([\w\.]+)\}\}/g, (match, varName) => {
    const value = resolveValue(varName, context, data);
    return value ? truncate(value) : '';
  });

  return template;
};

/**
 * Process simple variable replacement: {{variableName}}
 */
const processVariables = (template, data, context) => {
  return template.replace(/\{\{([\w\.]+)\}\}/g, (match, varName) => {
    const value = resolveValue(varName, context, data);
    if (value === undefined || value === null) return '';
    return escapeHtml(value);
  });
};

/**
 * Render template with data
 */
export const renderTemplate = (templateName, data = {}) => {
  try {
    let template = loadTemplate(templateName);

    // Process in order
    template = processConditionals(template, data);
    template = processLoops(template, data);
    template = processHelpers(template, data);
    template = processVariables(template, data);

    return template;
  } catch (error) {
    console.error(`Error rendering template ${templateName}:`, error);
    throw error;
  }
};

/**
 * Get all available templates
 */
export const getAvailableTemplates = () => {
  const files = fs.readdirSync(TEMPLATES_DIR);
  return files
    .filter(file => file.endsWith('.html'))
    .map(file => file.replace('.html', ''));
};

/**
 * Clear template cache (useful for development)
 */
export const clearTemplateCache = () => {
  Object.keys(templateCache).forEach(key => delete templateCache[key]);
};

export default {
  renderTemplate,
  getAvailableTemplates,
  clearTemplateCache,
  formatDate,
  formatCurrency,
  addDays,
  truncate,
  escapeHtml
};
