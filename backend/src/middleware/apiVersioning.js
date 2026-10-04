const SUPPORTED_API_VERSIONS = ['v1'];

export const apiVersioning = (req, res, next) => {
  try {
    const validPathMatch = req.path.match(/^\/api\/(v\d+)(\/|$)/);

    const invalidApiPath =
      req.path.startsWith('/api/') && !validPathMatch;

    if (invalidApiPath) {
      return res.status(400).json({
        success: false,
        message: 'Invalid API version path',
      });
    }

    const pathVersion = validPathMatch?.[1];

    const headerVersion = req.headers['accept-version'];

    const requestedVersion = pathVersion || headerVersion || 'v1';

    if (!SUPPORTED_API_VERSIONS.includes(requestedVersion)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported API version: ${requestedVersion}`,
        supportedVersions: SUPPORTED_API_VERSIONS,
      });
    }

    req.apiVersion = requestedVersion;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'API version processing failed',
    });
  }
};

export default apiVersioning;