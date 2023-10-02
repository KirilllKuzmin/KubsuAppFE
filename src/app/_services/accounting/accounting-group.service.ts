import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Student } from '@app/_models/student';
import { User } from '@app/_models';
import { catchError, tap } from 'rxjs';
import { Absence } from '@app/_models/dto/absence';

@Injectable({
  providedIn: 'root'
})
export class AccountingGroupService {
  constructor(private http: HttpClient) { }

  user: User;

  getGroupStudents(groupId: number) {
      return this.http.get<Student[]>(`${environment.apiUrlAcc}/accounting/groups/${groupId}/students`);
  }

  getAbsencesStudent(courseId: number, groupId: number) {
    return this.http.get<Absence[]>(`${environment.apiUrlAcc}/accounting/lecturers/absences/courses/${courseId}/groups/${groupId}`);
}

  getCourseDates(courseId: number, groupId: number) {
    return this.http.get<string[]>(`${environment.apiUrlAcc}/accounting/lecturers/courses/${courseId}/groups/${groupId}/dates`);
  }

  setAbsence(studentId: number, courseId: number, absenceDate: Date, absenceTypeId: string) {
    console.log(studentId);
    console.log(courseId);
    console.log(absenceDate);
    console.log(absenceTypeId);
    return this.http.post<string>(`${environment.apiUrlAcc}/accounting/lecturers/absences`, { studentId, courseId, absenceDate, absenceTypeId }).subscribe(response =>
      console.log(response))
  }
}
