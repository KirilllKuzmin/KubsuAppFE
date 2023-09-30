import { Pipe, PipeTransform } from '@angular/core';
import { Student } from '@app/_models/student';

@Pipe({
  name: 'filterStudent'
})
export class FilterStudentPipe implements PipeTransform {

  transform(students: Student[], filter: string): Student[] {
    return students.filter(student => student.fullName.toLowerCase().includes(filter.toLowerCase()))
  }

}
