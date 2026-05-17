const SENSITIVE_KEYS = new Set([
  'password',
  'confirmpassword',
  'confirm_password',
  'currentpassword',
  'current_password',
  'newpassword',
  'new_password',
  'token',
  'accesstoken',
  'access_token',
  'refreshtoken',
  'refresh_token',
]);

export function maskSensitiveFields(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(maskSensitiveFields);
  }

  if (typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        return [key, '***'];
      }

      return [key, maskSensitiveFields(nestedValue)];
    })
  );
}
