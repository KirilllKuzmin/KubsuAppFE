import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Student } from '@app/_models/student';

@Component({
  selector: 'app-filter-student',
  templateUrl: './filter-student.component.html',
  styleUrls: ['./filter-student.component.less']
})
export class FilterStudentComponent {
  selectedReason: string;

  apply() {
    // Здесь вы можете отправить выбранную причину отсутствия
    // Например, вы можете сохранить ее в переменной и передать в родительский компонент или сервис
    // Для простоты, можно просто закрыть всплывающее окно
    // Закрытие окна будет зависеть от вашей реализации
  }
}
