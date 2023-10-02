import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { Student } from '@app/_models/student';
import { AccountingGroupService } from '@app/_services/accounting/accounting-group.service';
import { Absence } from '@app/_models/dto/absence';

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
  absences: Absence[] = [];

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

      this.accountingGroupService.getAbsencesStudent(this.courseId, this.groupId).pipe(first()).subscribe(absences => {
        this.loading = false;
        this.absences = absences;
      });
  }

  hasUserIdAndDate(userId: number, absenceDate: Date) {

    const hasStudentWithIdAndDate = this.absences.some(item => item.student.userId === userId && new Date(item.absenceDate).toString() === absenceDate.toString());

    if (hasStudentWithIdAndDate) {
      return "Н";
    }
    return null;
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

  editedData: any[] = [];

  onEnterKey(event: any, student: Student, date: Date, i: number, j: number) {
    console.log(event);
    console.log(event.target.innerText);

    const modifiedValue = event.target.innerText;

    this.editedData.push({
      student,
      date,
      value: modifiedValue
    });

    console.log(this.editedData);
  }

  sendAbsences() {
    console.log("Отправляем: ");

    for (let index = 0; index < this.editedData.length; index++) {
      console.log(this.editedData[index].value);
      this.accountingGroupService.setAbsence(this.editedData[index].student.userId, this.courseId, this.editedData[index].date, this.editedData[index].value);
    }
  }

  isModalOpen = false;

  openModal() {
      console.log("press");
      this.isModalOpen = true;
  }

  closeModal() {
      this.isModalOpen = false;
  }

  navigateToCourseGroups() {
    this.router.navigate(['accounting/courses', this.courseId, 'groups']);
  }

  navigateToLecturerCourses() {
    this.router.navigate(['accounting/courses']);
  }
}
