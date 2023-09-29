import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { Group } from '@app/_models/group';
import { GroupsService } from '@app/_services/accounting/groups.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.less']
})
export class GroupsComponent implements OnInit {
  
  loading = false;
  groups: Group[] = [];
  courseId: number = 0;

  constructor(
    private groupsService: GroupsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
      this.loading = true;
      this.route.paramMap.subscribe(params => {
        const courseId = params.get('id');
        if (courseId) {
          this.courseId = +courseId;
        }
      });

      this.groupsService.getCourseGroups(this.courseId).pipe(first()).subscribe(groups => {
        this.loading = false;
        this.groups = groups;
      });      
  }

  navigateToLecturerCourses() {
    this.router.navigate(['accounting/courses']);
  }

  navigateToAccountingGroups(courseId: number, groupId: number) {
    this.router.navigate(['accounting/courses', courseId, 'groups', groupId]);
  }
}
