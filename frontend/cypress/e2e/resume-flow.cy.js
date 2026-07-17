describe('End-to-End Resume Enhancement User Journey', () => {
  beforeEach(() => {
    // Intercept Firebase tracking/auth calls and backend response pipelines
    cy.intercept('POST', '**/identitytoolkit/**', {
      statusCode: 200,
      body: { idToken: 'mock-session-jwt-token', localId: 'gssoc-test-user-123' }
    });

    cy.intercept('POST', '/api/upload', {
      statusCode: 200,
      body: { success: true, id: 'mock-resume-uuid-456' }
    }).as('uploadResume');

    cy.intercept('POST', '/api/enhance/mock-resume-uuid-456', {
      statusCode: 200,
      body: {
        success: true,
        score: 85,
        enhancedSections: {
          summary: 'Highly capable engineer specialized in cybersecurity and automation frameworks.',
          experience: 'Refactored systemic application architecture using room-based WebSockets.'
        }
      }
    }).as('enhanceResume');

    // Bootstrap local storage auth structure and load home workspace
    cy.mockFirebaseAuth();
    cy.visit('/');
  });

  it('should authenticate user, step through dropzone upload, and view AI dashboard score ring', () => {
    // 1. Verify user lands securely on protected dashboard space
    cy.visit('/dashboard');
    cy.url().should('include', '/dashboard');

    // 2. Select file fixture from the dropzone mechanism
    cy.get('[data-testid="dropzone"]')
      .should('exist')
      .selectFile('cypress/fixtures/test-resume.pdf', { action: 'drag-drop' });

    // 3. Trigger endpoint simulation and monitor routing updates
    cy.wait('@uploadResume');
    cy.url().should('include', '/enhance/mock-resume-uuid-456');

    // 4. Assert structural UI component renders correctly post-optimization
    cy.wait('@enhanceResume');
    cy.get('.confidence-meter, .score-ring, [data-testid="score-ring"]')
      .should('exist');
    cy.contains('Highly capable engineer').should('be.visible');
  });
});
