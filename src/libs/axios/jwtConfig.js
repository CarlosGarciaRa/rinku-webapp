export default {
  // Endpoints
  loginEndpoint: '/v1/login',
  registerEndpoint: '/jwt/register',
  // refreshEndpoint: '/jwt/refresh-token',
  refreshEndpoint: '/v1/renew',
  logoutEndpoint: '/jwt/logout',

  // This will be prefixed in authorization header with token
  // e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken'
};
