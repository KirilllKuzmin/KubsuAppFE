import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Group } from '@app/_models/group';
import { User } from '@app/_models';
import { UserService } from '@app/_services';
import { Subscription, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  constructor(private http: HttpClient, private userService: UserService) {}

  user: User;

  getCourseGroups(courseId: number) {
      const userObservable: Observable<User> = this.userService.getById();

      let userSubscribtion: Subscription;

      userSubscribtion = userObservable.subscribe((userSubs: User) => {
        this.user = userSubs;
      });

      return this.http.get<Group[]>(`${environment.apiUrlAcc}/accounting/lecturers/${this.user.id}/courses/${courseId}/groups`);
  }
}
