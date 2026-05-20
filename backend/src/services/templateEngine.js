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
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Process conditional blocks: {{#if condition}}...{{/if}}
 */
const processConditionals = (template, data) => {
  return template.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
    const value = getNestedValue(data, condition);
    return value ? content : '';
  });
};

/**
 * Process each loops: {{#each array}}...{{/each}}
 */
const processLoops = (template, data) => {
  return template.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayName, content) => {
    const array = data[arrayName];
    if (!Array.isArray(array)) return '';
    
    return array.map((item, index) => {
      let loopContent = content;
      
      // Replace item properties
      Object.keys(item).forEach(key => {
        const value = item[key];
        loopContent = loopContent.replace(
          new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
          escapeHtml(value)
        );
      });
      
      // Replace @index
      loopContent = loopContent.replace(/\{\{@index\}\}/g, index);
      
      return loopContent;
    }).join('');
  });
};

/**
 * Get nested object value using dot notation
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
};

/**
 * Process helper functions: {{functionName value}}
 */
const processHelpers = (template, data) => {
  // Process formatCurrency helper
  template = template.replace(/\{\{formatCurrency\s+(\w+)\}\}/g, (match, varName) => {
    const value = data[varName];
    return value ? formatCurrency(value) : '0';
  });

  // Process addDays helper
  template = template.replace(/\{\{addDays\s+(\w+)\}\}/g, (match, varName) => {
    const value = data[varName];
    return value ? addDays(value) : '';
  });

  // Process truncate helper
  template = template.replace(/\{\{truncate\s+(\w+)\s+(\d+)\}\}/g, (match, varName, length) => {
    const value = data[varName];
    return value ? truncate(value, parseInt(length)) : '';
  });

  // Process truncate without length argument
  template = template.replace(/\{\{truncate\s+(\w+)\}\}/g, (match, varName) => {
    const value = data[varName];
    return value ? truncate(value) : '';
  });

  return template;
};

/**
 * Process simple variable replacement: {{variableName}}
 */
const processVariables = (template, data) => {
  return template.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
    const value = data[varName];
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
