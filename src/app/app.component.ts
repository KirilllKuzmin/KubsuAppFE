import { Component, OnInit } from '@angular/core';
import { TranslationService } from './_services/translation.service';

import { AuthenticationService } from './_services';
import { User, Role } from './_models';
import { KeycloakService } from './_services/keycloak/keycloak.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  component: string = 'navigation';
  user?: User | undefined;
  content: any;

  constructor(
    private translationService: TranslationService,
    private keycloakService: KeycloakService
  ) {
    this.user = this.keycloakService.profile;
  }

  ngOnInit() {
    const language = 'ru';

    this.translationService
      .getContent(this.component, language)
      .subscribe((content: any) => {
        this.content = content;
      });
  }

  get isLecturer() {
    return this.getUserRoles().includes(Role.Lecturer);
  }

  get isModerator() {
    return this.getUserRoles().includes(Role.Moderator);
  }

  getUserRoles(): string[] {
    const roles: string[] = [];
    const realmAccess = this.keycloakService.keycloak.realmAccess;
    if (realmAccess) {
        roles.push(...realmAccess.roles);
    }
    return roles;
  }

  logout() {
    this.keycloakService.logout();
  }
}
