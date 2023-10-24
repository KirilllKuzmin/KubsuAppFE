import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { TimetableService } from '@app/_services/timetable.service';
import { NumTimeClassHeld } from '@app/_models/INumTimeClassHeld';
import { Timetable } from '@app/_models/ITimetable';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.less']
})
export class TimetableComponent implements OnInit {

  loading = false;
  weeklyDates: { dayOfWeekNum: number, dayOfWeek: string, date: Date}[] = []; //Вынести в отдельную модель
  numTimeClassHeld: NumTimeClassHeld[] = [];
  timetables: Timetable[] = [];


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private timetableService: TimetableService
  ) {
    this.generateWeeklyDates();
   }

  ngOnInit(): void {
    this.loading = true;
    this.timetableService.getNumTimeClassHeld().pipe(first()).subscribe(numTimeClassHeld => {
        this.loading = false;
        this.numTimeClassHeld = numTimeClassHeld;
    });

    this.timetableService.getAllTimetable(this.weeklyDates[1].date, this.weeklyDates[6].date).pipe(first()).subscribe(timetables => {
      this.loading = false;
      this.timetables = timetables;
  });
  }

  generateWeeklyDates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOfWeek = today.getDay(); 
    const startOfWeek = new Date(today); 

    startOfWeek.setDate(today.getDate() - dayOfWeek + 1); 

    const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      this.weeklyDates.push({
        dayOfWeekNum: i,
        dayOfWeek: daysOfWeek[i],
        date: currentDay,
      });
    }
  }

  filterTimetableByNumTimeAndDay(numTime: NumTimeClassHeld, day: { dayOfWeekNum: number, dayOfWeek: string, date: Date}) {
    return this.timetables.filter(timetable => {
      console.log(timetable.dayOfWeek === day.dayOfWeekNum + 1 && timetable.numberTimeClassHeld.id === numTime.id);
      return timetable.dayOfWeek === day.dayOfWeekNum + 1 && timetable.numberTimeClassHeld.id === numTime.id;
    });
  }

  navigateToCourseGroups(courseId: number) {
    this.router.navigate(['accounting/courses', courseId, 'groups']);
  }

  isNowDay(day: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return day.getTime() === today.getTime();
  }

}
