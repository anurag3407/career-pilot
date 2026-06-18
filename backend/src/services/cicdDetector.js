import YAML from 'js-yaml';
import fs from 'fs';
import path from 'path';

/**
 * CI/CD Pipeline Detector Service
 * 
 * Detects and analyzes CI/CD pipeline configurations in projects.
 * Supports multiple CI/CD platforms and provides detailed pipeline analysis.
 * 
 * Supported Platforms:
 * - GitHub Actions (.github/workflows/*.yml)
 * - GitLab CI (.gitlab-ci.yml)
 * - Jenkins (Jenkinsfile, Jenkinsfile.groovy)
 * - CircleCI (.circleci/config.yml)
 * - Travis CI (.travis.yml)
 * - Azure Pipelines (azure-pipelines.yml)
 * - Bitbucket Pipelines (bitbucket-pipelines.yml)
 */

// Platform configurations
const PLATFORM_CONFIGS = {
  'github-actions': {
    files: ['.github/workflows/**/*.yml', '.github/workflows/**/*.yaml'],
    parser: 'yaml',
    priority: 10
  },
  'gitlab-ci': {
    files: ['.gitlab-ci.yml'],
    parser: 'yaml',
    priority: 9
  },
  'jenkins': {
    files: ['Jenkinsfile', 'Jenkinsfile.groovy'],
    parser: 'groovy',
    priority: 8
  },
  'circleci': {
    files: ['.circleci/config.yml'],
    parser: 'yaml',
    priority: 7
  },
  'travis-ci': {
    files: ['.travis.yml'],
    parser: 'yaml',
    priority: 6
  },
  'azure-pipelines': {
    files: ['azure-pipelines.yml', 'azure-pipelines.yaml'],
    parser: 'yaml',
    priority: 5
  },
  'bitbucket-pipelines': {
    files: ['bitbucket-pipelines.yml'],
    parser: 'yaml',
    priority: 4
  }
};

/**
 * Detects CI/CD pipelines in a project directory
 * 
 * @param {string} projectPath - Path to the project root directory
 * @returns {Promise<Object>} Detection results
 * @throws {Error} If directory doesn't exist or is not readable
 * 
 * @example
 * const result = await detectCICDPipelines('/path/to/project');
 * // Returns:
 * // {
 * //   success: true,
 * //   pipelinesFound: 2,
 * //   pipelines: [
 * //     { platform: 'github-actions', files: [...], stages: [...] },
 * //     { platform: 'gitlab-ci', files: [...], stages: [...] }
 * //   ],
 * //   complexity: 'medium',
 * //   recommendations: [...]
 * // }
 */
export const detectCICDPipelines = async (projectPath) => {
  try {
    // Validate input
    if (!projectPath) {
      throw new Error('Project path is required');
    }

    // Check if directory exists and is readable
    if (!fs.existsSync(projectPath)) {
      throw new Error(`Project directory not found: ${projectPath}`);
    }

    const stats = fs.statSync(projectPath);
    if (!stats.isDirectory()) {
      throw new Error(`Path is not a directory: ${projectPath}`);
    }

    const pipelines = [];
    const detectedPlatforms = [];

    // Check each platform in priority order
    const sortedPlatforms = Object.entries(PLATFORM_CONFIGS).sort(
      (a, b) => b[1].priority - a[1].priority
    );

    for (const [platform, config] of sortedPlatforms) {
      const foundFiles = findConfigFiles(projectPath, config.files);
      
      if (foundFiles.length > 0) {
        const pipelineData = await analyzePipeline(
          platform,
          foundFiles,
          config.parser,
          projectPath
        );
        
        if (pipelineData) {
          pipelines.push(pipelineData);
          detectedPlatforms.push(platform);
        }
      }
    }

    // Generate analysis and recommendations
    const complexity = calculateComplexity(pipelines);
    const recommendations = generateRecommendations(pipelines, detectedPlatforms);

    return {
      success: true,
      projectPath,
      pipelinesFound: pipelines.length,
      detectedPlatforms,
      pipelines,
      complexity,
      recommendations,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      projectPath,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Finds configuration files matching the given patterns
 * 
 * @param {string} basePath - Base directory path
 * @param {string[]} patterns - File path patterns
 * @returns {string[]} Found file paths
 * @private
 */
function findConfigFiles(basePath, patterns) {
  const foundFiles = [];
  const gitHubWorkflowsPath = path.join(basePath, '.github', 'workflows');

  for (const pattern of patterns) {
    try {
      if (pattern.includes('**')) {
        // Handle GitHub Actions wildcard pattern
        if (fs.existsSync(gitHubWorkflowsPath)) {
          const files = fs.readdirSync(gitHubWorkflowsPath);
          for (const file of files) {
            if (file.endsWith('.yml') || file.endsWith('.yaml')) {
              const fullPath = path.join(gitHubWorkflowsPath, file);
              foundFiles.push(fullPath);
            }
          }
        }
      } else {
        // Handle simple file patterns
        const fullPath = path.join(basePath, pattern);
        if (fs.existsSync(fullPath)) {
          foundFiles.push(fullPath);
        }
      }
    } catch (error) {
      // Skip files that can't be accessed
      console.warn(`Warning: Could not access ${pattern}: ${error.message}`);
    }
  }

  return [...new Set(foundFiles)]; // Remove duplicates
}

/**
 * Analyzes a pipeline configuration file
 * 
 * @param {string} platform - Platform name
 * @param {string[]} files - File paths to analyze
 * @param {string} parser - Parser type ('yaml' or 'groovy')
 * @param {string} basePath - Base project path
 * @returns {Promise<Object|null>} Pipeline analysis or null if parsing fails
 * @private
 */
async function analyzePipeline(platform, files, parser, basePath) {
  try {
    const pipelineData = {
      platform,
      files: files.map(f => path.relative(basePath, f)),
      stages: [],
      jobs: [],
      triggers: [],
      variables: [],
      artifacts: false,
      caching: false,
      notifications: false,
      security: {
        secrets: false,
        branch_protection: false,
        approval_required: false
      }
    };

    for (const filePath of files) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        
        if (parser === 'yaml') {
          const parsed = YAML.load(content);
          if (parsed) {
            analyzeYAMLConfig(parsed, pipelineData, platform);
          }
        } else if (parser === 'groovy') {
          analyzeGroovyConfig(content, pipelineData);
        }
      } catch (error) {
        console.warn(`Warning: Could not parse ${filePath}: ${error.message}`);
      }
    }

    return pipelineData;
  } catch (error) {
    console.error(`Error analyzing pipeline for ${platform}:`, error.message);
    return null;
  }
}

/**
 * Analyzes YAML configuration
 * 
 * @param {Object} config - Parsed YAML configuration
 * @param {Object} pipelineData - Pipeline data object to populate
 * @param {string} platform - Platform name
 * @private
 */
function analyzeYAMLConfig(config, pipelineData, platform) {
  if (!config) return;

  // Platform-specific analysis
  switch (platform) {
    case 'github-actions':
      analyzeGitHubActions(config, pipelineData);
      break;
    case 'gitlab-ci':
      analyzeGitLabCI(config, pipelineData);
      break;
    case 'circleci':
      analyzeCircleCI(config, pipelineData);
      break;
    case 'travis-ci':
      analyzeTravisCI(config, pipelineData);
      break;
    case 'azure-pipelines':
      analyzeAzurePipelines(config, pipelineData);
      break;
    case 'bitbucket-pipelines':
      analyzeBitbucketPipelines(config, pipelineData);
      break;
  }
}

/**
 * Analyzes GitHub Actions configuration
 * @private
 */
function analyzeGitHubActions(config, pipelineData) {
  if (!config.jobs) return;

  Object.entries(config.jobs).forEach(([jobId, job]) => {
    const jobData = {
      id: jobId,
      name: job.name || jobId,
      steps: (job.steps || []).length,
      runsOn: job['runs-on'] || 'unknown'
    };

    pipelineData.jobs.push(jobData);
    pipelineData.stages.push(jobData.name);

    // Check for artifacts
    if (job.steps?.some(s => s.with?.['path'])) {
      pipelineData.artifacts = true;
    }

    // Check for caching
    if (job.steps?.some(s => s.uses?.includes('cache'))) {
      pipelineData.caching = true;
    }

    // Check for security
    if (job.steps?.some(s => s.env && Object.keys(s.env).length > 0)) {
      pipelineData.security.secrets = true;
    }
  });

  // Check triggers
  if (config.on) {
    pipelineData.triggers = Object.keys(config.on);
  }
}

/**
 * Analyzes GitLab CI configuration
 * @private
 */
function analyzeGitLabCI(config, pipelineData) {
  if (!config) return;

  if (config.stages) {
    pipelineData.stages = config.stages;
  }

  Object.entries(config).forEach(([key, job]) => {
    if (key.startsWith('.') || ['stages', 'variables', 'image'].includes(key)) return;
    
    if (job && typeof job === 'object') {
      const jobData = {
        id: key,
        name: job.name || key,
        stage: job.stage || 'default',
        script: (job.script || []).length
      };

      pipelineData.jobs.push(jobData);

      if (job.artifacts) pipelineData.artifacts = true;
      if (job.cache) pipelineData.caching = true;
      if (job.needs) pipelineData.security.approval_required = true;
    }
  });

  if (config.variables) {
    pipelineData.variables = Object.keys(config.variables);
    if (Object.keys(config.variables).length > 0) {
      pipelineData.security.secrets = true;
    }
  }
}

/**
 * Analyzes CircleCI configuration
 * @private
 */
function analyzeCircleCI(config, pipelineData) {
  if (!config || !config.jobs) return;

  pipelineData.jobs = Object.entries(config.jobs).map(([jobId, job]) => ({
    id: jobId,
    name: jobId,
    steps: (job.steps || []).length,
    docker: job.docker || []
  }));

  if (config.workflows) {
    Object.entries(config.workflows).forEach(([workflowId, workflow]) => {
      if (workflow.jobs) {
        workflow.jobs.forEach(jobRef => {
          const jobName = typeof jobRef === 'string' ? jobRef : Object.keys(jobRef)[0];
          pipelineData.stages.push(jobName);
        });
      }
    });
  }

  // Check for caching
  if (JSON.stringify(config).includes('save_cache') || JSON.stringify(config).includes('restore_cache')) {
    pipelineData.caching = true;
  }
}

/**
 * Analyzes Travis CI configuration
 * @private
 */
function analyzeTravisCI(config, pipelineData) {
  if (config.stages) {
    pipelineData.stages = config.stages;
  } else if (config.script) {
    pipelineData.stages.push('build');
  }

  if (config.install) {
    pipelineData.jobs.push({
      name: 'install',
      commands: Array.isArray(config.install) ? config.install.length : 1
    });
  }

  if (config.script) {
    pipelineData.jobs.push({
      name: 'script',
      commands: Array.isArray(config.script) ? config.script.length : 1
    });
  }

  if (config.cache) pipelineData.caching = true;
  if (config.notifications) pipelineData.notifications = true;
}

/**
 * Analyzes Azure Pipelines configuration
 * @private
 */
function analyzeAzurePipelines(config, pipelineData) {
  if (config.stages) {
    pipelineData.stages = config.stages.map(s => s.stage);
    pipelineData.jobs = config.stages.flatMap(stage =>
      (stage.jobs || []).map(job => ({
        name: job.job,
        displayName: job.displayName || job.job
      }))
    );
  }

  if (config.trigger) {
    pipelineData.triggers = Array.isArray(config.trigger) ? config.trigger : [config.trigger];
  }

  if (config.variables) {
    pipelineData.variables = Object.keys(config.variables);
    pipelineData.security.secrets = true;
  }
}

/**
 * Analyzes Bitbucket Pipelines configuration
 * @private
 */
function analyzeBitbucketPipelines(config, pipelineData) {
  if (!config.pipelines) return;

  const pipelines = config.pipelines;
  
  if (pipelines.default) {
    pipelineData.stages.push('default');
    if (pipelines.default.length) {
      pipelineData.jobs = pipelines.default.map((stage, idx) => ({
        name: `step-${idx + 1}`,
        image: stage.image || 'default'
      }));
    }
  }

  if (pipelines.branches) {
    Object.keys(pipelines.branches).forEach(branch => {
      pipelineData.triggers.push(`branch:${branch}`);
    });
  }

  if (config.definitions?.caches) {
    pipelineData.caching = true;
  }
}

/**
 * Analyzes Groovy configuration (Jenkins)
 * 
 * @param {string} content - File content
 * @param {Object} pipelineData - Pipeline data object
 * @private
 */
function analyzeGroovyConfig(content, pipelineData) {
  // Simple groovy parsing
  const stageRegex = /stage\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  const stageMatch = content.match(stageRegex);

  if (stageMatch) {
    pipelineData.stages = stageMatch.map(s => {
      const match = s.match(/stage\s*\(\s*['"]([^'"]+)['"]\s*\)/);
      return match ? match[1] : 'unknown';
    });
  }

  // Check for common Jenkins patterns
  if (content.includes('artifacts')) {
    pipelineData.artifacts = true;
  }
  if (content.includes('cache') || content.includes('stash')) {
    pipelineData.caching = true;
  }
  if (content.includes('credentials') || content.includes('withCredentials')) {
    pipelineData.security.secrets = true;
  }
  if (content.includes('input ') || content.includes('approval')) {
    pipelineData.security.approval_required = true;
  }
}

/**
 * Calculates pipeline complexity
 * 
 * @param {Object[]} pipelines - Detected pipelines
 * @returns {string} Complexity level ('low', 'medium', 'high')
 * @private
 */
function calculateComplexity(pipelines) {
  const totalJobs = pipelines.reduce((sum, p) => sum + (p.jobs?.length || 0), 0);
  const totalStages = pipelines.reduce((sum, p) => sum + (p.stages?.length || 0), 0);
  const hasArtifacts = pipelines.some(p => p.artifacts);
  const hasCaching = pipelines.some(p => p.caching);
  const hasApproval = pipelines.some(p => p.security?.approval_required);

  const complexityScore = totalJobs + totalStages + 
    (hasArtifacts ? 2 : 0) + 
    (hasCaching ? 1 : 0) + 
    (hasApproval ? 3 : 0);

  if (complexityScore > 15) return 'high';
  if (complexityScore > 7) return 'medium';
  return 'low';
}

/**
 * Generates recommendations based on pipeline analysis
 * 
 * @param {Object[]} pipelines - Detected pipelines
 * @param {string[]} platforms - Detected platforms
 * @returns {string[]} Recommendations
 * @private
 */
function generateRecommendations(pipelines, platforms) {
  const recommendations = [];

  if (platforms.length === 0) {
    recommendations.push('No CI/CD pipeline detected. Consider implementing one for automated testing and deployment.');
    return recommendations;
  }

  // Check for missing features
  const hasArtifacts = pipelines.some(p => p.artifacts);
  if (!hasArtifacts) {
    recommendations.push('Consider adding artifact storage for build outputs.');
  }

  const hasCaching = pipelines.some(p => p.caching);
  if (!hasCaching) {
    recommendations.push('Implement caching to improve pipeline performance.');
  }

  const hasSecrets = pipelines.some(p => p.security?.secrets);
  if (!hasSecrets) {
    recommendations.push('Ensure environment variables and secrets are properly managed.');
  }

  const hasApproval = pipelines.some(p => p.security?.approval_required);
  if (!hasApproval && platforms.length === 1) {
    recommendations.push('Add approval gates for production deployments.');
  }

  if (platforms.length > 1) {
    recommendations.push('Multiple CI/CD platforms detected. Consider standardizing on a single platform.');
  }

  const totalJobs = pipelines.reduce((sum, p) => sum + (p.jobs?.length || 0), 0);
  if (totalJobs > 10) {
    recommendations.push('Pipeline has many jobs. Consider optimizing with parallelization.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Pipeline configuration looks good. Consider adding documentation for team members.');
  }

  return recommendations;
}

/**
 * Generates a detailed report of CI/CD pipelines
 * 
 * @param {string} projectPath - Path to the project
 * @returns {Promise<Object>} Detailed report
 */
export const generateCICDReport = async (projectPath) => {
  const result = await detectCICDPipelines(projectPath);

  if (!result.success) {
    return result;
  }

  const report = {
    ...result,
    summary: {
      totalPlatforms: result.detectedPlatforms.length,
      totalPipelines: result.pipelinesFound,
      totalJobs: result.pipelines.reduce((sum, p) => sum + (p.jobs?.length || 0), 0),
      totalStages: result.pipelines.reduce((sum, p) => sum + (p.stages?.length || 0), 0),
      features: {
        artifacts: result.pipelines.some(p => p.artifacts),
        caching: result.pipelines.some(p => p.caching),
        notifications: result.pipelines.some(p => p.notifications),
        security: result.pipelines.some(p => Object.values(p.security).some(v => v))
      }
    },
    analysis: {
      complexity: result.complexity,
      recommendations: result.recommendations
    }
  };

  return report;
};

export default {
  detectCICDPipelines,
  generateCICDReport
};
