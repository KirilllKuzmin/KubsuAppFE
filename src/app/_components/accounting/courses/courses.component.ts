import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { Course } from '@app/_models';
import { CoursesService } from '@app/_services/accounting/courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.less'],
})
export class CoursesComponent {
  loading = false;
  courses: Course[] = [];

  constructor(
    private coursesService: CoursesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loading = true;
    this.coursesService
      .getLecturerCourses()
      .pipe(first())
      .subscribe((courses) => {
        this.loading = false;
        this.courses = courses;
      });
  }

  navigateToCourseGroups(courseId: number) {
    this.router.navigate(['accounting/courses', courseId, 'groups']);
  }
}
