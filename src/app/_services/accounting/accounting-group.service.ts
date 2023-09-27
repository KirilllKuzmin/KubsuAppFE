import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Student } from '@app/_models/student';

@Injectable({
  providedIn: 'root'
})
export class AccountingGroupService {
  constructor(private http: HttpClient) { }

  getGroupStudents(groupId: number) {
      return this.http.get<Student[]>(`${environment.apiUrlAcc}/accounting/groups/${groupId}/students`);
  }

  getCourseDates(courseId: number) {
    return this.http.get<string[]>(`${environment.apiUrlAcc}/accounting/courses/${courseId}/dates`);
}
}
