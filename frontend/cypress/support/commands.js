Cypress.Commands.add('mockFirebaseAuth', () => {
  // Simulating a deterministic user token state before application initialization
  window.localStorage.setItem(
    'firebase:authUser:',
    JSON.stringify({
      uid: 'gssoc-test-user-123',
      email: 'testuser@gssoc.org',
      displayName: 'Test Contributor',
      token: 'mock-session-jwt-token'
    })
  );
});
