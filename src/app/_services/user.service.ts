import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Group } from '@app/_models/interfaces/IGroup';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users/all`);
    }

    getById() {
        return this.http.get<User>(`${environment.apiUrl}/users`);
    }

    getAllGroupNames() {
        return this.http.get<Group[]>(`${environment.apiUrl}/users/groups`);
    }
}