import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Student } from '@app/_models/student';
import { User } from '@app/_models';
import { UserService } from '@app/_services';

@Injectable({
  providedIn: 'root'
})
export class AccountingGroupService {
  constructor(private http: HttpClient) { }

  user: User;

  getGroupStudents(groupId: number) {
      return this.http.get<Student[]>(`${environment.apiUrlAcc}/accounting/groups/${groupId}/students`);
  }

  getCourseDates(courseId: number, groupId: number) {
    return this.http.get<string[]>(`${environment.apiUrlAcc}/accounting/lecturers/courses/${courseId}/groups/${groupId}/dates`);
  }
}
