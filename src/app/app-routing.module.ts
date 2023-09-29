import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './_components/home';
import { AccountingGroupComponent } from './_components/accounting/accounting-group/accounting-group.component';
import { CoursesComponent } from './_components/accounting/courses/courses.component';
import { GroupsComponent } from './_components/accounting/groups/groups.component';
import { LoginComponent } from './_components/login';
import { AuthGuard } from './_helpers';
import { Role } from './_models';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'accounting/courses',
        component: CoursesComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Lecturer] }
    },
    {
        path: 'accounting/courses/:id/groups',
        component: GroupsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Lecturer] }
    },
    {
        path: 'accounting/courses/:courseId/groups/:groupId',
        component: AccountingGroupComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Lecturer] }
    },
    {
        path: 'login',
        component: LoginComponent
    },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
