import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { Student } from '@app/_models/interfaces/IStudent';
import { WorkDates } from '@app/_models/interfaces/IWorkDates';
import { AccountingGroupService } from '@app/_services/accounting/accounting.groups.service';
import { WorkTypeService } from '@app/_services/accounting/work-type.service';
import { Absence } from '@app/_models/interfaces/IAbsence';
import { Evaluation } from '@app/_models/interfaces/IEvaluation';
import { Month } from '@app/_models/enums/EMonths';

import * as XLSX from 'xlsx';
import { TypeOfWork } from '@app/_models/interfaces/ITypeOfWork';
import { EvaluationRequest } from '@app/_models/interfaces/IEvaluationRequest';

@Component({
  selector: 'app-accounting-group',
  templateUrl: './accounting.groups.component.html',
  styleUrls: ['./accounting.groups.component.less']
})
export class AccountingGroupComponent implements OnInit {
  
  loading = false;
  students: Student[] = [];
  courseId: number = 0;
  groupId: number = 0;
  dates: Date[] = [];
  datesAndWorks: { date: Date, work?: WorkDates }[] = [];
  months: { monthName: string, daysCount: number }[] = []; //В идеале перенести в _models
  filteredStudents: Student[] = [];
  isFilterOpen: boolean = false;
  searchStudent: string = '';
  absences: Absence[] = [];
  evaluations: Evaluation[] = [];
  workDates: WorkDates[] = [];
  showButton: boolean = false;
  currentMonth: string;


  @ViewChild('tableToExport') table: ElementRef;

  constructor(
    private accountingGroupService: AccountingGroupService,
    private router: Router,
    private route: ActivatedRoute,
    private workTypeService: WorkTypeService
  ) {  }

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

      const studentsRequest = this.accountingGroupService.getGroupStudents(this.groupId);
      const timetableDatesRequest = this.accountingGroupService.getCourseDates(this.courseId, this.groupId);
      const absenceDatesRequest = this.accountingGroupService.getAbsencesStudent(this.courseId, this.groupId);
      const evaluationDatesRequest = this.accountingGroupService.getEvaluationsStudent(this.courseId, this.groupId);
      const workDatesRequest = this.accountingGroupService.getWorkDates(this.courseId, this.groupId);

      forkJoin([studentsRequest, timetableDatesRequest, absenceDatesRequest, evaluationDatesRequest, workDatesRequest]).pipe(first()).subscribe(
        ([students, dates, absences, evaluations, workDates]) => {
          this.loading = false;
          this.students = students;
          this.dates = dates.map(dateString => new Date(dateString));
          this.absences = absences;
          this.evaluations = evaluations;
          this.workDates = workDates;

          const daysInMonthMap: { [month: string]: number } = {};

          for (const date of this.dates) {
            if (this.isWorkDate(date)) {
              const works = this.workDates
                .filter(workDate => new Date(workDate.workDateTime).getTime() === date.getTime());
              
              for (const work of works) {
                this.datesAndWorks.push({ date, work });
              }
            }
            this.datesAndWorks.push({ date });
          }

          for (const dateAndWork of this.datesAndWorks) {
            const monthKey = Month[dateAndWork.date.getMonth()];

            if (!daysInMonthMap[monthKey]) {
              daysInMonthMap[monthKey] = 0;
            }

            daysInMonthMap[monthKey]++;
          }

          for (const key in daysInMonthMap) {
            if (daysInMonthMap.hasOwnProperty(key)) {
              const monthName = key;
              const daysCount = daysInMonthMap[key];

              this.months.push({ monthName, daysCount });
            }
          }

        }
      );
  }

  hasUserIdAndDate(userId: number, absenceDate: Date, typeOfWork: number) {

    const hasStudentWithIdAndDateO = this.absences.some(item => item.student.userId === userId && new Date(item.absenceDate).toString() === absenceDate.toString() && item.absenceType.id === 1 && !typeOfWork);
    const hasStudentWithIdAndDateB = this.absences.some(item => item.student.userId === userId && new Date(item.absenceDate).toString() === absenceDate.toString() && item.absenceType.id === 2 && !typeOfWork);
    const hasStudentWithIdAndDateN = this.absences.some(item => item.student.userId === userId && new Date(item.absenceDate).toString() === absenceDate.toString() && item.absenceType.id === 3 && !typeOfWork);

    const hasStudentWithIdAndDateEvaluation = this.evaluations
      .some(item => item.student.userId === userId && new Date(item.evaluationDate).toString() === absenceDate.toString());

    if (hasStudentWithIdAndDateN) {
      return "Н";
    } else if (hasStudentWithIdAndDateB) {
      return "Б";
    } else if (hasStudentWithIdAndDateO) {
      return "О";
    } else if (hasStudentWithIdAndDateEvaluation) {
      let evaluationFiltered = this.evaluations
        .filter(item => item.student.userId === userId && new Date(item.evaluationDate).toString() === absenceDate.toString() && item.workDate.typeOfWork.id === typeOfWork)
        .map(item => item.evaluationGrade.pointNumber);

      const stringEvaluationFiltered: string = evaluationFiltered.join(', ');
      return stringEvaluationFiltered;
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

  onEnterKey(event: any, 
             student: Student, 
             typeOfWorkId: number, 
             date: Date, 
             i: number, 
             j: number, 
             evaluationGradeSystemId: number) {
    console.log(event);
    console.log(event.target.innerText);

    if (!this.showButton) {
      this.showButton = true;
    }

    const modifiedValue = event.target.innerText;

    this.editedData.push({
      student,
      typeOfWorkId,
      date,
      value: modifiedValue,
      evaluationGradeSystemId,
      isWorkDate: this.isWorkDateAndType(date, typeOfWorkId)
    });

    console.log(this.editedData);
  }

  //Очень не эффективно, переделать!!!
  sendAbsences() {
    console.log("Отправляем: ");

    let evaluationRequest: EvaluationRequest[] = [];

    for (let index = 0; index < this.editedData.length; index++) {
      console.log(this.editedData[index].value);
      if (!this.editedData[index].isWorkDate) {

        if (this.editedData[index].value === "О" || this.editedData[index].value === "о") {

          this.editedData[index].value = 1
          this.accountingGroupService.setAbsence(this.editedData[index].student.userId, this.courseId, this.editedData[index].date, this.editedData[index].value);
        } else if (this.editedData[index].value === "Б" || this.editedData[index].value === "б") {

          this.editedData[index].value = 2
          this.accountingGroupService.setAbsence(this.editedData[index].student.userId, this.courseId, this.editedData[index].date, this.editedData[index].value);
        } else if (this.editedData[index].value === "Н" || this.editedData[index].value === "н") {

          this.editedData[index].value = 3
          this.accountingGroupService.setAbsence(this.editedData[index].student.userId, this.courseId, this.editedData[index].date, this.editedData[index].value);
        } else if (this.editedData[index].value === "") {

          this.accountingGroupService.setAbsence(this.editedData[index].student.userId, this.courseId, this.editedData[index].date, this.editedData[index].value);
        }
      } else if (this.editedData[index].isWorkDate && this.editedData[index].value === "") {

        evaluationRequest.push({
          studentId: this.editedData[index].student.userId, 
          courseId: this.courseId, 
          typeOfWorkId: this.editedData[index].typeOfWorkId, 
          evaluationDate: this.editedData[index].date, 
          evaluationGradeSystemId: this.editedData[index].evaluationGradeSystemId, 
          pointNumber: this.editedData[index].value})
        
      } else if (this.editedData[index].isWorkDate) {
        evaluationRequest.push({
          studentId: this.editedData[index].student.userId, 
          courseId: this.courseId, 
          typeOfWorkId: this.editedData[index].typeOfWorkId, 
          evaluationDate: this.editedData[index].date, 
          evaluationGradeSystemId: this.editedData[index].evaluationGradeSystemId, 
          pointNumber: parseFloat(this.editedData[index].value)
        })

      } 
    }
    this.accountingGroupService.setEvaluation(evaluationRequest);
    
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

  isWorkDateAndType(date: Date, typeOfWorkId: number): boolean {
    return this.workDates.some(workDate => new Date(workDate.workDateTime).getTime() === date.getTime() && workDate.typeOfWork.id === typeOfWorkId);
  }

  getWorkType(date: Date) {
    return this.workDates
      .filter(workDate => new Date(workDate.workDateTime).getTime() === date.getTime())
      .map(workDate => workDate.typeOfWork.name.split(" ").map(word => word.charAt(0).toUpperCase()).join(""));
  }

  getMonthString(date: Date) {
    return Month[date.getMonth()];
  }

  getCountWorks(date: Date) {
    const filteredDates = this.workDates.filter(workDate => new Date(workDate.workDateTime).getTime() === date.getTime());
    return filteredDates.length + 1;
  }

  extractInitials(name: string): string {
    const words = name.split(' '); 
    const initials = words.map(word => word.charAt(0).toUpperCase()); 
    return initials.join(''); 
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
      //console.log("press");
      const workDates = this.workDates
        .filter(workDate => new Date(workDate.workDateTime).getTime() === date.getTime());
      
      console.log(workDates);

      this.workTypeService.setWorkDates(workDates);
      this.workTypeService.setDate(date);
      this.workTypeService.setCourseId(this.courseId);
      this.workTypeService.setGroupId(this.groupId);

      this.isModalOpenWorkType = true;
  }

  closeModalWorkType() {
      this.isModalOpenWorkType = false;
  }

  exportTableToXLSX() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    ws['!cols'] = [{ width: 15 }, { width: 15 }]

    XLSX.utils.book_append_sheet(wb, ws, 'Журнал группы');

    XLSX.writeFile(wb, 'table.xlsx');
  }

  navigateToCourseGroups() {
    this.router.navigate(['accounting/courses', this.courseId, 'groups']);
  }

  navigateToLecturerCourses() {
    this.router.navigate(['accounting/courses']);
  }
}
