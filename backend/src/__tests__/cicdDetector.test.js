import { describe, test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { detectCICDPipelines, generateCICDReport } from '../services/cicdDetector.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testProjectDir = path.join(__dirname, 'fixtures', 'cicd-test-project');

/**
 * Create test fixtures for CI/CD detector tests
 */
function createTestProject() {
  // Create base directory
  if (!fs.existsSync(testProjectDir)) {
    fs.mkdirSync(testProjectDir, { recursive: true });
  }

  // Create GitHub Actions workflow
  const workflowDir = path.join(testProjectDir, '.github', 'workflows');
  if (!fs.existsSync(workflowDir)) {
    fs.mkdirSync(workflowDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(workflowDir, 'ci.yml'),
    `name: CI Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/
      - uses: actions/cache@v3
        with:
          path: ~/.npm
          key: \${{ runner.os }}-npm-\${{ hashFiles('**/package-lock.json') }}

  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
`
  );

  // Create GitLab CI config
  fs.writeFileSync(
    path.join(testProjectDir, '.gitlab-ci.yml'),
    `stages:
  - build
  - test
  - deploy

variables:
  NODE_VERSION: '18'
  CACHE_DIR: .npm

build:
  stage: build
  image: node:\${NODE_VERSION}
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
  cache:
    paths:
      - node_modules/
      - .npm/

test:
  stage: test
  image: node:\${NODE_VERSION}
  script:
    - npm install
    - npm test
  needs:
    - build

deploy:
  stage: deploy
  image: node:\${NODE_VERSION}
  script:
    - npm install
    - npm run deploy
  only:
    - main
`
  );

  // Create Jenkins Jenkinsfile
  fs.writeFileSync(
    path.join(testProjectDir, 'Jenkinsfile'),
    `pipeline {
  agent any
  
  stages {
    stage('Build') {
      steps {
        script {
          echo 'Building...'
          sh 'npm install'
          sh 'npm run build'
        }
      }
      post {
        success {
          archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true
        }
      }
    }
    
    stage('Test') {
      steps {
        script {
          echo 'Testing...'
          sh 'npm test'
        }
      }
    }
    
    stage('Deploy') {
      steps {
        input 'Deploy to production?'
        script {
          echo 'Deploying...'
          sh 'npm run deploy'
        }
      }
    }
  }
  
  post {
    always {
      cleanWs()
    }
  }
}
`
  );
}

/**
 * Clean up test fixtures
 */
function cleanupTestProject() {
  if (fs.existsSync(testProjectDir)) {
    fs.rmSync(testProjectDir, { recursive: true, force: true });
  }
}

describe('CI/CD Pipeline Detector', () => {
  beforeEach(() => {
    createTestProject();
  });

  afterEach(() => {
    cleanupTestProject();
  });

  describe('detectCICDPipelines', () => {
    test('should detect multiple CI/CD platforms', async () => {
      const result = await detectCICDPipelines(testProjectDir);

      assert.equal(result.success, true);
      assert.equal(result.pipelinesFound, 3);
      assert.deepEqual(
        result.detectedPlatforms.sort(),
        ['github-actions', 'gitlab-ci', 'jenkins'].sort()
      );
    });

    test('should detect GitHub Actions workflows', async () => {
      const result = await detectCICDPipelines(testProjectDir);

      assert.equal(result.success, true);
      const githubActions = result.pipelines.find(p => p.platform === 'github-actions');
      
      assert.ok(githubActions);
      assert.equal(githubActions.jobs.length, 2);
      assert.deepEqual(
        githubActions.jobs.map(j => j.id).sort(),
        ['build', 'test'].sort()
      );
      assert.equal(githubActions.artifacts, true);
      assert.equal(githubActions.caching, true);
      assert.ok(githubActions.triggers.length > 0);
    });

    test('should detect GitLab CI configuration', async () => {
      const result = await detectCICDPipelines(testProjectDir);

      assert.equal(result.success, true);
      const gitlabCI = result.pipelines.find(p => p.platform === 'gitlab-ci');
      
      assert.ok(gitlabCI);
      assert.equal(gitlabCI.stages.length, 3);
      assert.deepEqual(gitlabCI.stages, ['build', 'test', 'deploy']);
      assert.equal(gitlabCI.artifacts, true);
      assert.equal(gitlabCI.caching, true);
      assert.equal(gitlabCI.security.secrets, true);
      assert.equal(gitlabCI.security.approval_required, true);
    });

    test('should detect Jenkins Jenkinsfile', async () => {
      const result = await detectCICDPipelines(testProjectDir);

      assert.equal(result.success, true);
      const jenkins = result.pipelines.find(p => p.platform === 'jenkins');
      
      assert.ok(jenkins);
      assert.equal(jenkins.stages.length, 3);
      assert.deepEqual(jenkins.stages, ['Build', 'Test', 'Deploy']);
      assert.equal(jenkins.artifacts, true);
      assert.equal(jenkins.security.approval_required, true);
    });

    test('should calculate complexity correctly', async () => {
      const result = await detectCICDPipelines(testProjectDir);

      assert.equal(result.success, true);
      assert.equal(result.complexity, 'high');
    });

    test('should generate recommendations', async () => {
      const result = await detectCICDPipelines(testProjectDir);

      assert.equal(result.success, true);
      assert.ok(result.recommendations.length > 0);
      assert.ok(Array.isArray(result.recommendations));
    });

    test('should handle non-existent directory', async () => {
      const result = await detectCICDPipelines('/non/existent/path');

      assert.equal(result.success, false);
      assert.ok(result.error);
      assert.match(result.error, /not found/i);
    });

    test('should handle null project path', async () => {
      const result = await detectCICDPipelines(null);

      assert.equal(result.success, false);
      assert.ok(result.error);
    });

    test('should handle file as path instead of directory', async () => {
      const filePath = path.join(testProjectDir, '.github', 'workflows', 'ci.yml');
      const result = await detectCICDPipelines(filePath);

      assert.equal(result.success, false);
      assert.ok(result.error);
    });

    test('should detect when no pipelines exist', async () => {
      const emptyDir = path.join(__dirname, 'fixtures', 'empty-project');
      fs.mkdirSync(emptyDir, { recursive: true });

      try {
        const result = await detectCICDPipelines(emptyDir);

        assert.equal(result.success, true);
        assert.equal(result.pipelinesFound, 0);
        assert.equal(result.detectedPlatforms.length, 0);
        assert.ok(result.recommendations.length > 0);
      } finally {
        fs.rmSync(emptyDir, { recursive: true, force: true });
      }
    });

    test('should handle malformed YAML gracefully', async () => {
      const malformedDir = path.join(__dirname, 'fixtures', 'malformed-project');
      const workflowDir = path.join(malformedDir, '.github', 'workflows');
      fs.mkdirSync(workflowDir, { recursive: true });

      fs.writeFileSync(
        path.join(workflowDir, 'malformed.yml'),
        `this: is: invalid: yaml: {`
      );

      try {
        const result = await detectCICDPipelines(malformedDir);

        assert.equal(result.success, true);
        // Should handle error gracefully without crashing
      } finally {
        fs.rmSync(malformedDir, { recursive: true, force: true });
      }
    });
  });

  describe('generateCICDReport', () => {
    test('should generate comprehensive report', async () => {
      const report = await generateCICDReport(testProjectDir);

      assert.equal(report.success, true);
      assert.ok(report.summary);
      assert.ok(report.analysis);
      assert.ok(report.pipelines);
      
      assert.equal(report.summary.totalPlatforms, 3);
      assert.ok(report.summary.totalJobs > 0);
      assert.ok(report.summary.totalStages > 0);
      assert.equal(report.summary.features.artifacts, true);
      assert.equal(report.summary.features.caching, true);
      assert.equal(report.summary.features.security, true);
    });

    test('should include timestamps in report', async () => {
      const report = await generateCICDReport(testProjectDir);

      assert.equal(report.success, true);
      assert.ok(report.timestamp);
      assert.match(report.timestamp, /\d{4}-\d{2}-\d{2}T/);
    });

    test('report should match detectCICDPipelines output', async () => {
      const report = await generateCICDReport(testProjectDir);
      const detection = await detectCICDPipelines(testProjectDir);

      assert.equal(report.success, detection.success);
      assert.equal(report.pipelinesFound, detection.pipelinesFound);
      assert.deepEqual(
        report.detectedPlatforms.sort(),
        detection.detectedPlatforms.sort()
      );
    });
  });

  describe('Performance', () => {
    test('should detect pipelines efficiently', async () => {
      const startTime = Date.now();
      await detectCICDPipelines(testProjectDir);
      const duration = Date.now() - startTime;

      // Should complete in less than 1 second
      assert.ok(duration < 1000, `Detection took ${duration}ms, expected < 1000ms`);
    });

    test('should handle large number of workflow files', async () => {
      // Create multiple workflow files
      const workflowDir = path.join(testProjectDir, '.github', 'workflows');
      for (let i = 0; i < 10; i++) {
        fs.writeFileSync(
          path.join(workflowDir, `workflow-${i}.yml`),
          `name: Workflow ${i}
on: push
jobs:
  job${i}:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Job ${i}"`
        );
      }

      const startTime = Date.now();
      const result = await detectCICDPipelines(testProjectDir);
      const duration = Date.now() - startTime;

      assert.equal(result.success, true);
      assert.ok(duration < 2000, `Detection with 10 workflows took ${duration}ms`);
    });
  });

  describe('Error handling', () => {
    test('should return error object on failure', async () => {
      const result = await detectCICDPipelines('/invalid/path');

      assert.equal(result.success, false);
      assert.ok(result.error);
      assert.ok(result.timestamp);
      assert.equal(result.projectPath, '/invalid/path');
    });

    test('should not throw exceptions', async () => {
      try {
        await detectCICDPipelines(null);
        await detectCICDPipelines('/non/existent');
        await detectCICDPipelines(path.join(testProjectDir, '.github'));
        // Should not throw
        assert.ok(true);
      } catch (error) {
        assert.fail('Should not throw exceptions');
      }
    });

    test('should handle permission errors gracefully', async () => {
      // This test might be platform-specific
      const restrictedDir = path.join(testProjectDir, 'restricted');
      fs.mkdirSync(restrictedDir, { recursive: true });

      try {
        fs.chmodSync(restrictedDir, 0o000);
        
        // The function should still return a result without crashing
        const result = await detectCICDPipelines(testProjectDir);
        assert.ok(result);
      } catch (error) {
        // Expected in some environments
        assert.ok(true);
      } finally {
        try {
          fs.chmodSync(restrictedDir, 0o755);
          fs.rmSync(restrictedDir, { recursive: true, force: true });
        } catch (e) {
          // Cleanup errors are acceptable
        }
      }
    });
  });
});
