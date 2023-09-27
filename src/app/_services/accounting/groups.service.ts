import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Group } from '@app/_models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  constructor(private http: HttpClient) { }

  getCourseGroups(courseId: number) {
      return this.http.get<Group[]>(`${environment.apiUrlAcc}/accounting/courses/${courseId}/groups`);
  }
}
