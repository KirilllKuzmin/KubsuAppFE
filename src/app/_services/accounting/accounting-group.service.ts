import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Student } from '@app/_models/student';
import { User } from '@app/_models';
import { UserService } from '@app/_services';
import { Subscription, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountingGroupService {
  constructor(private http: HttpClient, private userService: UserService) { }

  user: User;

  getGroupStudents(groupId: number) {
      return this.http.get<Student[]>(`${environment.apiUrlAcc}/accounting/groups/${groupId}/students`);
  }

  getCourseDates(courseId: number, groupId: number) {
    const userObservable: Observable<User> = this.userService.getById();

      let userSubscribtion: Subscription;

      userSubscribtion = userObservable.subscribe((userSubs: User) => {
        this.user = userSubs;
      });

    return this.http.get<string[]>(`${environment.apiUrlAcc}/accounting/lecturers/${this.user.id}/courses/${courseId}/groups/${groupId}/dates`);
}
}
