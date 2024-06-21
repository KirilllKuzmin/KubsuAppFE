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
  user?: User | null;
  content: any;

  constructor(
    private authenticationService: AuthenticationService,
    private translationService: TranslationService,
    private keycloakService: KeycloakService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
    //this.keycloakService.keycloak.
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
    return this.user?.roles?.includes(Role.Lecturer);
  }

  get isModerator() {
    return this.user?.roles?.includes(Role.Moderator);
  }

  logout() {
    this.keycloakService.logout();
  }
}
