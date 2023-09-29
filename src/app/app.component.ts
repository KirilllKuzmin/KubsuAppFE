﻿import { Component } from '@angular/core';

import { AuthenticationService } from './_services';
import { User, Role } from './_models';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {
    user?: User | null;

    constructor(private authenticationService: AuthenticationService) {
        this.authenticationService.user.subscribe(x => this.user = x);
    }

    get isLecturer() {
        return this.user?.roles.includes(Role.Lecturer);
    }

    logout() {
        this.authenticationService.logout();
    }
}