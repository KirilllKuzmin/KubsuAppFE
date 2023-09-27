import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { Student } from '@app/_models/student';
import { AccountingGroupService } from '@app/_services/accounting/accounting-group.service';

@Component({
  selector: 'app-accounting-group',
  templateUrl: './accounting-group.component.html',
  styleUrls: ['./accounting-group.component.less']
})
export class AccountingGroupComponent implements OnInit {
  
  loading = false;
  students: Student[] = [];
  courseId: number = 0;
  groupId: number = 0;
  dates: Date[] = [];

  constructor(
    private accountingGroupService: AccountingGroupService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
      this.loading = true;
      this.route.paramMap.subscribe(params => {
        const courseId = params.get('courseId');
        if (courseId) {
          this.courseId = +courseId;
        }

        const groupId = params.get('groupId');
        if (groupId) {
          this.groupId = +groupId;
        }
      });

      this.accountingGroupService.getGroupStudents(this.groupId).pipe(first()).subscribe(students => {
        this.loading = false;
        this.students = students;
      });
      
      this.accountingGroupService.getCourseDates(this.courseId).pipe(first()).subscribe(dates => {
        this.loading = false;
        this.dates = dates.map(dateString => new Date(dateString));
      });
  }

  navigateToCourseGroups() {
    this.router.navigate(['accounting/courses', this.courseId, 'groups']);
  }
}
