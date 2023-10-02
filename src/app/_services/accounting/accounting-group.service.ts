import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Student } from '@app/_models/student';
import { User } from '@app/_models';

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

  setAbsence(studentId: number, courseId: number, absenceDate: Date, absenceTypeId: string) {
    return this.http.post<string>(`${environment.apiUrlAcc}/accounting/lecturers/setAbsences`, { studentId, courseId, absenceDate, absenceTypeId });
  }
}
