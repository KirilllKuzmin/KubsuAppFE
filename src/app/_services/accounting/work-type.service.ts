import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TypeOfWork } from '@app/_models/ITypeOfWork';
import { WorkDates } from '@app/_models/dto/IWorkDates';
import { environment } from '@environments/environment';
import { formatISO } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class WorkTypeService {

  private workDate: Date;
  private courseId: number;
  private groupId: number;
  private typeOfWork: TypeOfWork;

  constructor(private http: HttpClient) {}

  setWorkDate(value: Date) {
    this.workDate = value;
  }

  getWorkDate() {
    return this.workDate;
  }

  setCourseId(courseId: number) {
    this.courseId = courseId;
  }

  getCourseId() {
    return this.courseId;
  }

  setGroupId(groupId: number) {
    this.groupId = groupId;
  }

  getGroupId() {
    return this.groupId;
  }

  getWorkType() {
    return this.http.get<TypeOfWork[]>(`${environment.apiUrlAcc}/accounting/workTypes`);
  }

  setWorkDates(courseId: number, groupId: number, typeOfWork: number, workDate: Date) {
    console.log(courseId);
    console.log(groupId);
    console.log(typeOfWork);
    console.log(formatISO(workDate, {representation: 'complete'}));
    if (typeOfWork === undefined || typeOfWork === null) {
      typeOfWork = 0;
    }
    return this.http.post<WorkDates>(`${environment.apiUrlAcc}/accounting/lecturers/courses/${courseId}/groups/${groupId}/works/${typeOfWork}/dates/${formatISO(workDate, {representation: 'complete'})}`, {})
      .subscribe(response =>
        console.log(response))
  }
}
