import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { TypeOfWork } from '@app/_models/ITypeOfWork';
import { WorkTypeService } from '@app/_services/accounting/work-type.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-work-type',
  templateUrl: './work-type.component.html',
  styleUrls: ['./work-type.component.less']
})
export class WorkTypeComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<boolean>();
  loading = false;
  workTypes: TypeOfWork[] = [];
  selectedWorkType: number;
  workDate = this.workTypeService.getWorkDate();

  constructor(private workTypeService: WorkTypeService) {}

  ngOnInit(): void {
    this.workTypeService.getWorkType().pipe(first()).subscribe(workTypes => {
      this.loading = false;
      this.workTypes = workTypes;
    });
    
  }

  closeModal() {
    this.closeModalEvent.emit(true);
  }

  sendWorkType() {
    this.closeModalEvent.emit(true);
    return null;
  }
}
