import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Course } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class CoursesService {
  constructor(private http: HttpClient) {}

  getLecturerCourses() {
    return this.http.get<Course[]>(
      `${environment.apiUrlAcc}/accounting/lecturers/courses`
    );
  }
}
