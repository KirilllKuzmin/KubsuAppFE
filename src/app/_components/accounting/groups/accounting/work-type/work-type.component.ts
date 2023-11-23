import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { TypeOfWork } from '@app/_models/interfaces/ITypeOfWork';
import { WorkTypeService } from '@app/_services/accounting/work-type.service';
import { first } from 'rxjs/operators';
import { WorkDates } from '@app/_models/interfaces/IWorkDates';
import { forkJoin } from 'rxjs';
import { SetWorkDate } from '@app/_models/interfaces/ISetWorkDate';

@Component({
  selector: 'app-work-type',
  templateUrl: './work-type.component.html',
  styleUrls: ['./work-type.component.less'],
})
export class WorkTypeComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<boolean>();
  loading = false;
  workTypes: TypeOfWork[] = [];
  workDates = this.workTypeService.getWorkDates();
  courseId = this.workTypeService.getCourseId();
  groupId = this.workTypeService.getGroupId();
  date = this.workTypeService.getDate();
  isChecked: boolean[] = [];

  //ВР
  minGrade: number;
  maxGrade: number;
  passingGrade: number;

  constructor(private workTypeService: WorkTypeService) {}

  ngOnInit(): void {
    const workDatesRequest = this.workTypeService.getWorkType();

    forkJoin([workDatesRequest])
      .pipe(first())
      .subscribe(([workTypes]) => {
        this.loading = false;
        this.workTypes = workTypes;

        for (const workType of this.workTypes) {
          if (
            this.workDates.some(
              (workDate) => workDate.typeOfWork.id === workType.id
            )
          ) {
            this.isChecked[workType.id] = true;
          } else {
            this.isChecked[workType.id] = false;
          }
        }
      });
  }

  closeModal() {
    this.closeModalEvent.emit(true);
  }

  toggleSelection(workType: TypeOfWork) {
    //console.log(this.isSelected(workType.id));
    if (this.isSelected(workType.id)) {
      this.workDates = this.workDates.filter(
        (workDate) => workDate.typeOfWork.id !== workType.id
      );
    } else {
      const workDate: WorkDates = {
        typeOfWork: workType,
        workDateTime: this.date,
      };
      this.workDates.push(workDate);
    }
  }

  isSelected(workTypeId: number) {
    return this.workDates.some(
      (workDate) => workDate.typeOfWork.id === workTypeId
    );
  }

  sendWorkType() {
    let checkAnyTrue = false;
    //let workTypeIds: number[] = [];
    let setWorkDates: SetWorkDate[] = [];

    for (let i = 0; i < this.isChecked.length; i++) {
      console.log(i + ' ' + this.isChecked[i]);
      if (this.isChecked[i] === true) {
        checkAnyTrue = true;
        
        let setWorkDate: SetWorkDate = {
          typeOfWorkId: i,
          minGrade: 2,
          maxGrade: 5,
          passingGrade: 3
        };

        setWorkDates.push(setWorkDate);
      }
    }

    this.workTypeService.setWorks(
      this.courseId,
      this.groupId,
      setWorkDates,
      this.date
    );
    //window.location.reload();
  }
}
