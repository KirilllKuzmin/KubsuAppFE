import { Component } from '@angular/core';
import { TranslationService } from './_services/translation.service'; 

import { AuthenticationService } from './_services';
import { User, Role } from './_models';

@Component({ 
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent {
    user?: User | null;

    constructor(private authenticationService: AuthenticationService) {
        this.authenticationService.user.subscribe(x => this.user = x);
    }

    get isLecturer() {
        return this.user?.roles.includes(Role.Lecturer);
    }

    get isModerator() {
        return this.user?.roles.includes(Role.Moderator);
    }

    logout() {
        this.authenticationService.logout();
    }
}