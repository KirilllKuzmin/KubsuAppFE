import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent {
  loading = false;
  user: User;
  userFromApi?: User;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {
    this.user = <User>this.authenticationService.userValue;
  }

  ngOnInit() {
    // this.loading = true;
    // this.userService
    //   .getById()
    //   .pipe(first())
    //   .subscribe((user) => {
    //     this.loading = false;
    //     this.userFromApi = user;
    //   });
  }
}
