import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './_components/home';
import { AccountingGroupComponent } from './_components/accounting/groups/accounting/accounting.groups.component';
import { CoursesComponent } from './_components/accounting/courses/courses.component';
import { GroupsComponent } from './_components/accounting/groups/groups.component';
import { ReportComponent } from './_components/report/report.component';
import { LoginComponent } from './_components/login';
import { TimetableComponent } from './_components/timetable/timetable.component';
import { AuthGuard } from './_helpers';
import { Role } from './_models';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'accounting/courses',
    component: CoursesComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Lecturer, Role.Moderator] }, //ВР, поскольку он на вход передает первую попавшуюся роль и не дает вход
  },
  {
    path: 'accounting/courses/:id/groups',
    component: GroupsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Lecturer, Role.Moderator] }, //ВР, поскольку он на вход передает первую попавшуюся роль и не дает вход
  },
  {
    path: 'accounting/courses/:courseId/groups/:groupId',
    component: AccountingGroupComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Lecturer, Role.Moderator] }, //ВР, поскольку он на вход передает первую попавшуюся роль и не дает вход
  },
  {
    path: 'timetable',
    component: TimetableComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reports',
    component: ReportComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Lecturer, Role.Moderator] },
  },
  {
    path: 'login',
    component: LoginComponent,
  },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
