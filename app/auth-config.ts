import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '@env/environment';

export const authConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: environment.issuer, //'http://localhost/identityserver',

  // URL of the SPA to redirect the user to after login
  redirectUri: environment.redirectUri, // 'http://localhost:4200',

  // The SPA's id. The SPA is registered with this id at the auth-server
  clientId: 'patheyamvert-web-client',
  postLogoutRedirectUri: environment.redirectUri + '?l=1', //'http://localhost:4200?l=1',
  responseType: 'id_token token',

  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  scope: 'openid patheyam-api profile'
};
