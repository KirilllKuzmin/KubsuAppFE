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

  private workDates: WorkDates[];
  private date: Date;
  private courseId: number;
  private groupId: number;
  private typeOfWork: TypeOfWork;

  constructor(private http: HttpClient) {}

  setWorkDates(workDates: WorkDates[]) {
    this.workDates = workDates;
  }

  getWorkDates() {
    return this.workDates;
  }

  setDate(date: Date) {
    this.date = date;
  }

  getDate() {
    return this.date;
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

  setWorks(courseId: number, groupId: number, typeOfWorks: number[], workDate: Date) {
    console.log(courseId);
    console.log(groupId);
    console.log(typeOfWorks);
    console.log(formatISO(workDate, {representation: 'complete'}));

    return this.http.post<WorkDates[]>(`${environment.apiUrlAcc}/accounting/lecturers/courses/${courseId}/groups/${groupId}/dates/${formatISO(workDate, {representation: 'complete'})}/works`, 
      typeOfWorks )
        .subscribe(response =>
          console.log(response))
  }
}
