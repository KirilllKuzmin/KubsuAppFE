import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Student } from '@app/_models/student';

@Component({
  selector: 'app-filter-student',
  templateUrl: './filter-student.component.html',
  styleUrls: ['./filter-student.component.less']
})
export class FilterStudentComponent {
  @Input() students: Student[] = [];
  @Output() filterChange = new EventEmitter<Student[]>();

  selectedStudents: Set<number> = new Set<number>();

  toggleStudentSelection(student: Student) {
    if (this.selectedStudents.has(student.userId)) {
      this.selectedStudents.delete(student.userId);
    } else {
      this.selectedStudents.add(student.userId);
    }
  }

  applyFilter() {
    const selectedStudentsArray: Student[] = this.students.filter(student =>
      this.selectedStudents.has(student.userId)
    );

    this.filterChange.emit(selectedStudentsArray);
  }
}
