import { Component, OnInit, HostListener } from '@angular/core';
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
  filteredStudents: Student[] = [];
  isFilterOpen: boolean = false;
  searchStudent: string = '';

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
      
      this.accountingGroupService.getCourseDates(this.courseId, this.groupId).pipe(first()).subscribe(dates => {
        this.loading = false;
        this.dates = dates.map(dateString => new Date(dateString));
      });
  }

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  filterStudents(selectedStudents: Student[]) {
    this.filteredStudents = selectedStudents;
    this.isFilterOpen = false;
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    // Завершение изменения размера колонки
    this.resizing = false;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.resizing) {
      const newWidth = this.initialWidth + (event.clientX - this.initialX);
      this.columnWidth = newWidth + 'px';
    }
  }

  resizing = false;
  initialX: number = 0;
  initialWidth: number = 0;
  columnWidth: string = '100px'; 

  startResize(event: MouseEvent, width: number) {
    this.resizing = true;
    this.initialX = event.clientX;
    this.initialWidth = width;
  }

  navigateToCourseGroups() {
    this.router.navigate(['accounting/courses', this.courseId, 'groups']);
  }

  navigateToLecturerCourses() {
    this.router.navigate(['accounting/courses']);
  }
}
