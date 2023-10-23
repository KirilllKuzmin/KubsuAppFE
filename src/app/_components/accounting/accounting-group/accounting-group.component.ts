import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { Student } from '@app/_models/student';
import { WorkDates } from '@app/_models/dto/IWorkDates';
import { AccountingGroupService } from '@app/_services/accounting/accounting-group.service';
import { WorkTypeService } from '@app/_services/accounting/work-type.service';
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
  workDates: WorkDates[] = [];

  constructor(
    private accountingGroupService: AccountingGroupService,
    private router: Router,
    private route: ActivatedRoute,
    private workTypeService: WorkTypeService
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

      // this.accountingGroupService.getGroupStudents(this.groupId).pipe(first()).subscribe(students => {
      //   this.loading = false;
      //   this.students = students;
      // });
      
      // this.accountingGroupService.getCourseDates(this.courseId, this.groupId).pipe(first()).subscribe(dates => {
      //   this.loading = false;
      //   this.dates = dates.map(dateString => new Date(dateString));
      // });

      // this.accountingGroupService.getAbsencesStudent(this.courseId, this.groupId).pipe(first()).subscribe(absences => {
      //   this.loading = false;
      //   this.absences = absences;
      // });

      // this.accountingGroupService.getWorkDates(this.courseId, this.groupId).pipe(first()).subscribe(workDates => {
      //   this.loading = false;
      //   this.workDates = workDates;
      // });

      const studentsRequest = this.accountingGroupService.getGroupStudents(this.groupId);
      const timetableDatesRequest = this.accountingGroupService.getCourseDates(this.courseId, this.groupId);
      const absenceDatesRequest = this.accountingGroupService.getAbsencesStudent(this.courseId, this.groupId);
      const workDatesRequest = this.accountingGroupService.getWorkDates(this.courseId, this.groupId);

      forkJoin([studentsRequest, timetableDatesRequest, absenceDatesRequest, workDatesRequest]).pipe(first()).subscribe(
        ([students, dates, absences, workDates]) => {
          this.loading = false;
          this.students = students;
          this.dates = dates.map(dateString => new Date(dateString));
          this.absences = absences;
          this.workDates = workDates;
          console.log(workDates);
        }
      );
  }

  hasUserIdAndDate(userId: number, absenceDate: Date) {

    const hasStudentWithIdAndDateO = this.absences.some(item => item.student.userId === userId && new Date(item.absenceDate).toString() === absenceDate.toString() && item.absenceType.id === 1);
    const hasStudentWithIdAndDateB = this.absences.some(item => item.student.userId === userId && new Date(item.absenceDate).toString() === absenceDate.toString() && item.absenceType.id === 2);
    const hasStudentWithIdAndDateN = this.absences.some(item => item.student.userId === userId && new Date(item.absenceDate).toString() === absenceDate.toString() && item.absenceType.id === 3);

    if (hasStudentWithIdAndDateN) {
      return "Н";
    } else if (hasStudentWithIdAndDateB) {
      return "Б";
    } else if (hasStudentWithIdAndDateO) {
      return "О";
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
      if (this.editedData[index].value === "О" || this.editedData[index].value === "о") {
        this.editedData[index].value = 1
      } else if (this.editedData[index].value === "Б" || this.editedData[index].value === "б") {
        this.editedData[index].value = 2
      } else if (this.editedData[index].value === "Н" || this.editedData[index].value === "н") {
        this.editedData[index].value = 3
      }
      this.accountingGroupService.setAbsence(this.editedData[index].student.userId, this.courseId, this.editedData[index].date, this.editedData[index].value);
    }
    
    window.location.reload();
  }

  isEditable(date: Date): boolean {
    const selectedDate = new Date(date);
    const currentDate = new Date;

    const daysDifference = Math.floor((currentDate.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24));

    return daysDifference > 14;
  }

  isWorkDate(date: Date): boolean {
    return this.workDates.some(workDate => new Date(workDate.workDateTime).getTime() === date.getTime());
  }

  getWorkType(date: Date) {
    return this.workDates
      .filter(workDate => new Date(workDate.workDateTime).getTime() === date.getTime())
      .map(workDate => workDate.typeOfWork.name.split(" ").map(word => word.charAt(0).toUpperCase()).join(""));
  }

  isModalOpen = false;

  openModal() {
      console.log("press");
      this.isModalOpen = true;
  }

  closeModal() {
      this.isModalOpen = false;
  }

  isModalOpenWorkType = false;

  openModalWorkType(date: Date) {
      console.log("press");
      this.workTypeService.setWorkDate(date);
      this.workTypeService.setCourseId(this.courseId);
      this.workTypeService.setGroupId(this.groupId);
      this.isModalOpenWorkType = true;
  }

  closeModalWorkType() {
      this.isModalOpenWorkType = false;
  }

  navigateToCourseGroups() {
    this.router.navigate(['accounting/courses', this.courseId, 'groups']);
  }

  navigateToLecturerCourses() {
    this.router.navigate(['accounting/courses']);
  }
}
