import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-student',
  templateUrl: './filter-student.component.html',
  styleUrls: ['./filter-student.component.less'],
})
export class FilterStudentComponent {
  @Output() closeModalEvent = new EventEmitter<boolean>();

  closeModal() {
    this.closeModalEvent.emit(true);
  }
}
