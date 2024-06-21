import { Injectable } from '@angular/core';
import { User } from '@app/_models';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private _keycloak: Keycloak | undefined;
  private _profile: User | undefined;

  get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: 'http://localhost:9098',
        realm: 'kubsu-app',
        clientId: 'kubsu-app-fe'
      });
    }
    return this._keycloak;
  }

  get profile(): User | undefined {
    return this._profile;
  }

  constructor() { }

  async init() {
    const authenticated = await this.keycloak?.init({
      onLoad: 'login-required'
    });

    if (authenticated) {
      this._profile = (await this.keycloak?.loadUserProfile()) as User;
      this._profile.token = this.keycloak?.token;
    }
  }

  login() {
    return this.keycloak?.login();
  }

  logout() {
    return this.keycloak?.logout({redirectUri: 'http://localhost:4200'})
  }
}
