import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { TimetableService } from '@app/_services/timetable.service';
import { NumTimeClassHeld } from '@app/_models/INumTimeClassHeld';
import { Timetable } from '@app/_models/ITimetable';
import { User } from '@app/_models';
import { AuthenticationService, UserService } from '@app/_services';

import { formatISO } from 'date-fns';
import { formatDate } from '@angular/common';
import { Group } from '@app/_models/group';
import { TimetableGroup } from '@app/_models/ITimetableGroup';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.less']
})
export class TimetableComponent implements OnInit {

  loading = false;
  user: User;
  userFromApi?: User;
  groups: Group[] = [];

  weeklyDates: { dayOfWeekNum: number, dayOfWeek: string, date: Date}[] = []; //Вынести в отдельную модель
  numTimeClassHeld: NumTimeClassHeld[] = [];
  timetables: Timetable[] = [];

  currentDate = new Date();
  currentDateISO = formatISO(this.currentDate);
  weekNumber: number;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private timetableService: TimetableService,
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {
    this.generateWeeklyDates();
    this.user = <User>this.authenticationService.userValue;
   }

  ngOnInit(): void {
    this.loading = true;
    this.timetableService.getNumTimeClassHeld().pipe(first()).subscribe(numTimeClassHeld => {
        this.loading = false;
        this.numTimeClassHeld = numTimeClassHeld;
    });

    let saturday = new Date(this.weeklyDates[5].date);
    saturday.setDate(saturday.getDate() + 1)

    this.timetableService.getAllTimetable(this.weeklyDates[1].date, saturday).pipe(first()).subscribe(timetables => {
      this.loading = false;
      this.timetables = timetables;
    });

    this.userService.getById().pipe(first()).subscribe(user => {
     this.loading = false;
      this.userFromApi = user;
    });

    this.userService.getAllGroupNames().pipe(first()).subscribe(groups => {
      this.loading = false;
       this.groups = groups;
     });
    
    this.weekNumber = parseInt(formatDate(formatISO(this.weeklyDates[0].date), 'w', 'en-US'));
  }

  getWeekNumberToNumber(currDate: Date) {
    const weekNumber = formatDate(currDate, 'w', 'UTC');
    return parseInt(weekNumber);
  }

  generateWeeklyDates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOfWeek = today.getDay(); 
    const startOfWeek = new Date(today); 

    startOfWeek.setDate(today.getDate() - dayOfWeek + 1); 

    const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

    for (let i = 0; i < 6; i++) {
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

  getGroupNamesByIds(groupIds: TimetableGroup[]): string {
    const groupNames: string[] = groupIds.map(timetableGroups => {
      const group = this.groups.find(g => g.id === timetableGroups.groupId);
      return group ? group.name : 'Группа не найдена';
    });
    
    return groupNames.join(', ');
  }

  getTimetablesForNextWeek() {
    const startOfWeek = this.weeklyDates[0].date; 
    startOfWeek.setDate(startOfWeek.getDate() + 7);

    for (let i = 0; i < 6; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      this.weeklyDates[i].date = currentDay;
    }

    this.weekNumber = parseInt(formatDate(formatISO(this.weeklyDates[0].date), 'w', 'en-US'));

    let saturday = new Date(this.weeklyDates[5].date);
    saturday.setDate(saturday.getDate() + 1)

    this.timetableService.getAllTimetable(this.weeklyDates[1].date, saturday).pipe(first()).subscribe(timetables => {
      this.loading = false;
      this.timetables = timetables;
    });
  }

  getTimetablesForPreviousWeek() {
    const startOfWeek = this.weeklyDates[0].date; 
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    for (let i = 0; i < 6; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      this.weeklyDates[i].date = currentDay;
    }

    this.weekNumber = parseInt(formatDate(formatISO(this.weeklyDates[0].date), 'w', 'en-US'));

    let saturday = new Date(this.weeklyDates[5].date);
    saturday.setDate(saturday.getDate() + 1)

    this.timetableService.getAllTimetable(this.weeklyDates[1].date, saturday).pipe(first()).subscribe(timetables => {
      this.loading = false;
      this.timetables = timetables;
    });
  }

  getTimetablesForNow() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOfWeek = today.getDay(); 
    const startOfWeek = new Date(today); 

    startOfWeek.setDate(today.getDate() - dayOfWeek + 1); 

    for (let i = 0; i < 6; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      this.weeklyDates[i].date = currentDay;
    }

    this.weekNumber = parseInt(formatDate(formatISO(this.weeklyDates[0].date), 'w', 'en-US'));

    let saturday = new Date(this.weeklyDates[5].date);
    saturday.setDate(saturday.getDate() + 1)

    this.timetableService.getAllTimetable(this.weeklyDates[1].date, saturday).pipe(first()).subscribe(timetables => {
      this.loading = false;
      this.timetables = timetables;
    });
  }
}
