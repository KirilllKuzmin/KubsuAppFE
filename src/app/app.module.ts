import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './_components/home';
import { CoursesComponent } from './_components/accounting/courses/courses.component';
import { LoginComponent } from './_components/login';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GroupsComponent } from './_components/accounting/groups/groups.component';
import { AccountingGroupComponent } from './_components/accounting/groups/accounting/accounting.groups.component';
import { AdjustHeightDirective } from './_helpers/adjust-height.directive';
import { FilterStudentComponent } from './_components/accounting/groups/accounting/filter-student/filter-student.component';
import { FilterStudentPipe } from './_pipes/filter-student.pipe';
import { ReportComponent } from './_components/report/report.component';
import { WorkTypeComponent } from './_components/accounting/groups/accounting/work-type/work-type.component';
import { TimetableComponent } from './_components/timetable/timetable.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/labels/navigation', '.json');
}

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            defaultLanguage: 'ru',
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
          })
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        CoursesComponent,
        LoginComponent,
        GroupsComponent,
        AccountingGroupComponent,
        AdjustHeightDirective,
        FilterStudentComponent,
        FilterStudentPipe,
        ReportComponent,
        WorkTypeComponent,
        TimetableComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }