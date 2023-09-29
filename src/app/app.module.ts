import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './_components/home';
import { CoursesComponent } from './_components/accounting/courses/courses.component';
import { LoginComponent } from './_components/login';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GroupsComponent } from './_components/accounting/groups/groups.component';
import { AccountingGroupComponent } from './_components/accounting/accounting-group/accounting-group.component';
import { AdjustHeightDirective } from './_helpers/adjust-height.directive';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule
,
        BrowserAnimationsModule    ],
    declarations: [
        AppComponent,
        HomeComponent,
        CoursesComponent,
        LoginComponent,
        GroupsComponent,
        AccountingGroupComponent,
        AdjustHeightDirective
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }