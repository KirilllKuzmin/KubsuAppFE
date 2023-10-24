import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@environments/environment';
import { NumTimeClassHeld } from '@app/_models/INumTimeClassHeld';
import { Timetable } from '@app/_models/ITimetable';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  constructor(private http: HttpClient) { }

  getNumTimeClassHeld() {
    return this.http.get<NumTimeClassHeld[]>(`${environment.apiUrlAcc}/timetables/number-time-classes-held`);
  }

  getAllTimetable(startDate: Date, endDate: Date) {
    const params = new HttpParams()
      .set('start_date', startDate.toISOString())
      .set('end_date', endDate.toISOString());

    return this.http.get<Timetable[]>(`${environment.apiUrlAcc}/timetables`, { params: params });
  }
}
