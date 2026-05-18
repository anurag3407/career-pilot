import axios from 'axios';

const LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LINKEDIN_USERINFO_URL = "https://api.linkedin.com/v2/userinfo";

const { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI } =
  process.env;

/**
 * Build LinkedIn authorization URL
 * @param {string} state - Random CSRF token
 */
export const getLinkedInAuthUrl = (state) => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: LINKEDIN_REDIRECT_URI,
    scope: "openid profile email",
    state,
  });
  return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
};

/**
 * Exchange authorization code for access token
 * @param {string} code - Code from LinkedIn callback
 */
export const exchangeCodeForToken = async (code) => {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: LINKEDIN_REDIRECT_URI,
    client_id: LINKEDIN_CLIENT_ID,
    client_secret: LINKEDIN_CLIENT_SECRET,
  });

  const response = await axios.post(LINKEDIN_TOKEN_URL, params.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return {
        accessToken: response.data.access_token,
        idToken: response.data.id_token,
    };
};

/**
 * Fetch LinkedIn user profile using OpenID Connect userInfo endpoint
 * @param {string} accessToken
 */
export const getLinkedInProfile = async (accessToken, idToken) => {
  const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64url').toString())

  return {
    linkedinId: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture || null,
  };
};
