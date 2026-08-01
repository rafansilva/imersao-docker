export const environment = {
  production: true,
  apiUrl: '',
  tokenAllowedDomains: [ /algamoney-api.com/ ],
  tokenDisallowedRoutes: [ /\/oauth2\/token/ ],
  oauthCallbackUrl: "http://local-algamoney.com:4200/authorized",
  logoutRedirectUrl: "http://local-algamoney.com:4200"
};
