import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Group } from '@app/_models/group';
import { User } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  user: User;
  userFromApi?: User;

  constructor(private http: HttpClient) {}

  getCourseGroups(courseId: number) {
    return this.http.get<Group[]>(`${environment.apiUrlAcc}/accounting/lecturers/courses/${courseId}/groups`);
  }
}
