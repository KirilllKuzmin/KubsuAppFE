import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TypeOfWork } from '@app/_models/ITypeOfWork';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkTypeService {

  private workDate: Date;

  constructor(private http: HttpClient) {}

  setWorkDate(value: Date) {
    this.workDate = value;
  }

  getWorkDate() {
    return this.workDate;
  }

  getWorkType() {
    return this.http.get<TypeOfWork[]>(`${environment.apiUrlAcc}/accounting/workTypes`);
  }
}
