import { JwtHelperService } from '@auth0/angular-jwt';
import { lastValueFrom } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  oauthTokenUrl = environment.apiUrl + "/oauth2/token";
  oauthAuthorizeUrl = environment.apiUrl + "/oauth2/authorize";
  jwtPayload: any;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    this.carregarToken();
   }

  login() {
    const state = this.gerarStringAleatoria(40);
    const codeVerifier = this.gerarStringAleatoria(128);

    localStorage.setItem("state", state);
    localStorage.setItem("codeVerifier", codeVerifier);

    const challengeMethod = "S256";
    const codeChallenge = CryptoJS.SHA256(codeVerifier)
      .toString(CryptoJS.enc.Base64)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const redirectUri = encodeURIComponent(environment.oauthCallbackUrl);

    const clientId = "angular";
    const scope = "read write";
    const responseType = "code";

    const params = [
      'response_type=' + responseType,
      'client_id=' + clientId,
      'scope=' + scope,
      'code_challenge=' + codeChallenge,
      'code_challenge_method=' + challengeMethod,
      'state=' + state,
      'redirect_uri=' + redirectUri
    ]

    window.location.href = this.oauthAuthorizeUrl + '?' + params.join('&');
  }

  logout() {
    this.limparAccessToken();
    localStorage.clear();
    window.location.href = environment.apiUrl + "/logout?returnTo=" + environment.logoutRedirectUrl;
  }

  obterNovoAccessTokenComCode(code: string, state: string): Promise<void> {
    const stateSalvo = localStorage.getItem("state");

    if (state !== stateSalvo) {
      return Promise.reject(null);
    }

    const codeVerifier = localStorage.getItem("codeVerifier");

    const headers = new HttpHeaders()
      .append("Content-type", "application/x-www-form-urlencoded")
      .append("Authorization", "Basic YW5ndWxhcjpAbmd1bEByMA==");

    const payload = new HttpParams()
      .append("grant_type", "authorization_code")
      .append("code", code)
      .append("code_verifier", codeVerifier)  
      .append("redirect_uri", environment.oauthCallbackUrl);

    return lastValueFrom(this.http.post(this.oauthTokenUrl, payload, { headers }))
      .then((response: any) => {
        this.armazenarToken(response['access_token']);
        this.armazenarRefreshToken(response['refresh_token']);
        console.log('Novo access token criado!');

        localStorage.removeItem("state");
        localStorage.removeItem("codeVerifier");

        return Promise.resolve(null);
      })
      .catch((response: any) => {
        console.log("Erro ao gerar token com o code. ", response);
        return Promise.resolve(null);
      });
  }

  obterNovoAccessToken(): Promise<void> {
    const headers = new HttpHeaders()
    .append("Content-type", "application/x-www-form-urlencoded")
    .append("Authorization", "Basic YW5ndWxhcjpAbmd1bEByMA==");

    const payload = new HttpParams()
      .append("grant_type", "refresh_token")
      .append("refresh_token", localStorage.getItem("refreshToken"));

    return lastValueFrom(this.http.post(this.oauthTokenUrl, payload, { headers }))
    .then((response: any) => {
      this.armazenarToken(response['access_token']);
      this.armazenarRefreshToken(response['refresh_token']);
      console.log('Novo access token criado!');

      return Promise.resolve(null);
    })
    .catch((response: any) => {
      console.log("Erro ao renovar token. ", response);
      return Promise.resolve(null);
    });
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');

    return !token || this.jwtHelper.isTokenExpired(token);
  }

  temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  temQualquerPermissao(roles: any) {
    for(let role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }

    return false;
  }

  limparAccessToken() {
    localStorage.removeItem("token");
    this.jwtPayload = null;
  }

  private armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem("token", token);
  }

  private armazenarRefreshToken(refreshToken: string) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  private carregarToken() {
    const token = localStorage.getItem("token");

    if (token) {
      this.armazenarToken(token);
    }
  }

  private gerarStringAleatoria(tamanho: number) {
    let resultado = '';
    //Chars que são URL safe
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < tamanho; i++) {
      resultado += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return resultado;
}
}
