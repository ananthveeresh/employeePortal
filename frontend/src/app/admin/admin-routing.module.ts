import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { adminScreensComponent } from './screens/screens.component';
import { HomeworkComponent } from './screens/homework/homework.component';
import { ExamCategoryComponent } from './screens/exam-category/exam-category.component';
import { SubjectsComponent } from './screens/subjects/subjects.component';
import { ChangePasswordComponent } from './screens/change-password/change-password.component';
import { StudentIntimationComponent } from './screens/student-intimation/student-intimation.component';
import { ExamMarksEntryComponent } from './screens/exam-marks-entry/exam-marks-entry.component';
import { ReportCardComponent } from './screens/report-card/report-card.component';
import { CbseTermendComponent } from './screens/cbse-termend/cbse-termend.component';
import { TermendEditOrUpdateComponent } from './screens/termend-edit-or-update/termend-edit-or-update.component';
import { StdExamAdditionalDetailsComponent } from './screens/std-exam-additional-details/std-exam-additional-details.component';
import { TermendReportCardComponent } from './screens/termend-report-card/termend-report-card.component';
import { ExammarksPosttoAnalysisComponent } from './screens/exammarks-postto-analysis/exammarks-postto-analysis.component';
import { EnquiryFormComponent } from './screens/enquiry-form/enquiry-form.component';
import { EnquiryFormEntryComponent } from './screens/enquiry-form-entry/enquiry-form-entry.component';


const routes: Routes = [
  {
    path:'',
    component: adminScreensComponent,
    children:[
      {
        path:'',
        component: DashboardComponent
      },
      {
        path:'dashboard',
        component: DashboardComponent
      },
      {
        path:'homework',
        component:  HomeworkComponent
      },
      {
        path:'exam-category',
        component:  ExamCategoryComponent
      },
      {
        path:'subjects',
        component: SubjectsComponent
      },
      {
        path:'change-password',
        component: ChangePasswordComponent
      },
      {
        path:'student-intimation',
        component: StudentIntimationComponent
      },
      {
        path:'enquiry-form',
        component:EnquiryFormComponent
      },
      {
        path:'enquiry-form-entry',
        component:EnquiryFormEntryComponent
      },
      {
        path:'exam-marks-entry',
        component: ExamMarksEntryComponent
      },
      {
        path:'report-card/:sectionid/:examid/:succode',
        component: ReportCardComponent
      },
      {
        path:'termend-report-card/:sectionid/:examid/:succode',
        component: TermendReportCardComponent,
        children: [
          {
            path: 'termend-report-card',
            component: TermendReportCardComponent // Your child component where you need the _id
          }
        ]
      },
      {
        path:'cbse_termend',
        component: CbseTermendComponent
      },
      {
        path:'exammarks-postto-analysis',
        component: ExammarksPosttoAnalysisComponent
      },
      { 
        path: 'termend_edit_or_update/:exam_id/:section_id/:subject', component: TermendEditOrUpdateComponent
       },
       { 
        path: 'std_exam_additional_details/:exam_id/:section_id/:std_id', component: StdExamAdditionalDetailsComponent
       },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
