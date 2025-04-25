import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { MenuComponent } from './menu/menu.component';
import { adminScreensComponent } from './screens/screens.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { BlankpageComponent } from './screens/blankpage/blankpage.component';
import { HomeworkComponent } from './screens/homework/homework.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExamCategoryComponent } from './screens/exam-category/exam-category.component';
import { SubjectsComponent } from './screens/subjects/subjects.component'; // Import ReactiveFormsModule
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './screens/change-password/change-password.component';
import { StudentIntimationComponent } from './screens/student-intimation/student-intimation.component';
import { ExamMarksEntryComponent } from './screens/exam-marks-entry/exam-marks-entry.component';
import { ReportCardComponent } from './screens/report-card/report-card.component';
import { CbseTermendComponent } from './screens/cbse-termend/cbse-termend.component';
import { TermendEditOrUpdateComponent } from './screens/termend-edit-or-update/termend-edit-or-update.component';
import { StdExamAdditionalDetailsComponent } from './screens/std-exam-additional-details/std-exam-additional-details.component';
import { TermendReportCardComponent } from './screens/termend-report-card/termend-report-card.component';
import { HttpClientModule } from '@angular/common/http';
import { ExammarksPosttoAnalysisComponent } from './screens/exammarks-postto-analysis/exammarks-postto-analysis.component';
import { EnquiryFormComponent } from './screens/enquiry-form/enquiry-form.component';
import { EnquiryFormEntryComponent } from './screens/enquiry-form-entry/enquiry-form-entry.component';
import { TextCapitalizePipe } from '../core/services/text-capitalize.pipe';






@NgModule({
  declarations: [
    MenuComponent,
    adminScreensComponent,
    DashboardComponent,
    BlankpageComponent,
    HomeworkComponent,
    ExamCategoryComponent,
    SubjectsComponent,
    ChangePasswordComponent,
    StudentIntimationComponent,
    ExamMarksEntryComponent,
    ReportCardComponent,
    CbseTermendComponent,
    TermendEditOrUpdateComponent,
    StdExamAdditionalDetailsComponent,
    TermendReportCardComponent,
    ExammarksPosttoAnalysisComponent,
    EnquiryFormComponent,
    EnquiryFormEntryComponent,
    TextCapitalizePipe
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    HttpClientModule
  ]
})
export class AdminModule { }
