import environment from 'platform/utilities/environment';
import { API_SIGN_IN_SERVICE_URL } from 'platform/user/authentication/constants';
import { OAUTH_KEYS, INFO_TOKEN } from './constants';
import * as oauthCrypto from './crypto';

export async function pkceChallengeFromVerifier(v) {
  if (!v || !v.length) return null;
  const hashed = await oauthCrypto.sha256(v);
  return oauthCrypto.base64UrlEncode(hashed);
}

export const saveStateAndVerifier = () => {
  /*
    Ensures saved state is not overwritten if location has state parameter.
  */
  if (window.location.search.includes('state')) return null;
  const storage = window.sessionStorage;

  // Create and store a random "state" value
  const state = oauthCrypto.generateRandomString(28);

  // Create and store a new PKCE code_verifier (the plaintext random secret)
  const codeVerifier = oauthCrypto.generateRandomString(64);

  storage.setItem('state', state);
  storage.setItem('code_verifier', codeVerifier);

  return { state, codeVerifier };
};

export const removeStateAndVerifier = () => {
  const storage = window.sessionStorage;

  storage.removeItem('state');
  storage.removeItem('code_verifier');
};

/**
 *
 * @param {String} csp
 */
export async function createOAuthRequest(csp) {
  const { state, codeVerifier } = saveStateAndVerifier();
  // Hash and base64-urlencode the secret to use as the challenge
  const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);

  // Build the authorization URL
  const oAuthParams = {
    [OAUTH_KEYS.CLIENT_ID]: encodeURIComponent('web'),
    [OAUTH_KEYS.REDIRECT_URI]: encodeURIComponent(
      `${environment.BASE_URL}/auth/login/callback/`,
    ),
    [OAUTH_KEYS.RESPONSE_TYPE]: 'code',
    [OAUTH_KEYS.SCOPE]: 'email',
    [OAUTH_KEYS.STATE]: state,
    [OAUTH_KEYS.CODE_CHALLENGE]: codeChallenge,
    [OAUTH_KEYS.CODE_CHALLENGE_METHOD]: 'S256',
  };

  const url = new URL(API_SIGN_IN_SERVICE_URL({ type: `/${csp}` }));

  Object.keys(oAuthParams).forEach(param =>
    url.searchParams.append(param, oAuthParams[param]),
  );

  // Redirect to the authorization server
  window.location = url;
}

export const getCV = () => {
  const codeVerifier = sessionStorage.getItem('code_verifier');
  return { codeVerifier };
};

export function buildTokenRequest({
  code,
  redirectUri = `${environment.BASE_URL}`,
} = {}) {
  const { codeVerifier } = getCV();

  if (!code || !codeVerifier) return null;

  // Build the authorization URL
  const oAuthParams = {
    [OAUTH_KEYS.GRANT_TYPE]: 'authorization_code',
    [OAUTH_KEYS.CLIENT_ID]: encodeURIComponent('web'),
    [OAUTH_KEYS.REDIRECT_URI]: encodeURIComponent(redirectUri),
    [OAUTH_KEYS.CODE]: code,
    [OAUTH_KEYS.CODE_VERIFIER]: codeVerifier,
  };

  const url = new URL(API_SIGN_IN_SERVICE_URL({ endpoint: '/token' }));

  Object.keys(oAuthParams).forEach(param =>
    url.searchParams.append(param, oAuthParams[param]),
  );

  return url;
}

export const requestToken = async ({ code, redirectUri }) => {
  const url = buildTokenRequest({
    code,
    redirectUri,
  });

  if (!url) return null;

  const response = await fetch(url.toString(), {
    method: 'POST',
    credentials: 'include',
  });

  if (response.ok) {
    removeStateAndVerifier();
  }

  return response;
};

export const infoTokenExists = () => {
  return document.cookie.includes(INFO_TOKEN);
};

export const formatInfoCookie = unformattedCookie =>
  unformattedCookie.split(',+:').reduce((obj, cookieString) => {
    const [key, value] = cookieString.replace(/{:|}/g, '').split('=>');
    const formattedValue = value.replaceAll('++00:00', '').replaceAll('+', ' ');
    return { ...obj, [key]: new Date(formattedValue) };
  }, {});

export const getInfoToken = () => {
  if (!infoTokenExists()) return null;

  return document.cookie
    .split(';')
    .map(cookie => cookie.split('='))
    .reduce((_, [cookieKey, cookieValue]) => ({
      ...(cookieKey.includes(INFO_TOKEN) && {
        ...formatInfoCookie(decodeURIComponent(cookieValue)),
      }),
    }));
};

export const refresh = async () => {
  // Build the authorization URL
  const oAuthParams = {
    [OAUTH_KEYS.CLIENT_ID]: encodeURIComponent('web'),
  };

  const url = new URL(API_SIGN_IN_SERVICE_URL({ endpoint: '/refresh' }));

  Object.keys(oAuthParams).forEach(param =>
    url.searchParams.append(param, oAuthParams[param]),
  );

  const response = await fetch(url.toString(), {
    method: 'POST',
    credentials: 'include',
  });

  if (response.ok) {
    removeStateAndVerifier();
  }

  return response;
};