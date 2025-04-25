import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ExamMarksEntryService } from "src/app/core/services/exam-marks-entry.service";
import { GradeCalcService } from "src/app/core/services/grade-calc.service";
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-exammarks-postto-analysis',
  templateUrl: './exammarks-postto-analysis.component.html',
  styleUrls: ['./exammarks-postto-analysis.component.css']
})
export class ExammarksPosttoAnalysisComponent implements OnInit {
  marks_entry_form: FormGroup;
  exam_Sections_List: any = [];
  logininfo: any = {};
  logininfo_yr: any;
  exam_List_Data: any = [];
  sec_Id: any;

  constructor(
    private fb: FormBuilder,
    private _exam_marks_entry_Service: ExamMarksEntryService,
    private _GradeCalcService: GradeCalcService,
    private http: HttpClient,
  ) {
    this.marks_entry_form = this.fb.group({
      sectionid: [""],
      examid: [""],
    });
  }

  ngOnInit(): void {
    this.logininfo = localStorage.getItem("logindata");
    this.logininfo = JSON.parse(this.logininfo);
    this.logininfo_yr = localStorage.getItem("logindata_yr");
    this.logininfo_yr = JSON.parse(this.logininfo_yr);
    // console.log(this.logininfo)
    // console.log(this.logininfo_yr)
    this._exam_marks_entry_Service
      .exam_all_sections(this.logininfo_yr[0].year_id, this.logininfo.campusId)
      .subscribe((data: any) => {
        // console.log(data)
        if (data.length > 0) {
          this.exam_Sections_List = data;
        }
      });
  }

  getExams(section_id: any) {
    //  console.log(this.marks_entry_form.value.sectionid)
    this.marks_entry_form.controls["examid"].setValue("");
    this.exam_List_Data = [];
    this.sec_Id = section_id.target.value;
    var obj = {
      year_id: this.logininfo_yr[0].year_id,
      section_id: this.sec_Id,
    };
    this._exam_marks_entry_Service.exams_list(obj).subscribe((data) => {
      //  console.log(data);
      if (data.length > 0) {
        this.exam_List_Data = data.filter(
          (e: { sub_cat_name: any }) => e.sub_cat_name != "TERM"
        );
        // this.examDate = this.exam_List_Data[0].exam_date;
      } else {
        this.exam_List_Data = [];

        this.marks_entry_form.controls["examid"].setValue("");
      }
    });

  }

  exammarks_pushtoanalysis() {
    var selectedcourseid = this.exam_Sections_List.filter((e: any) => e.id == this.marks_entry_form.value.sectionid)[0].course_id
    var obj = {
      "year_id": this.logininfo_yr[0].year_id,
      "year_name": this.logininfo_yr[0].year_name,
      "campus": this.logininfo.campusName,
      "campus_id": this.logininfo.campusId,
      "exam_id": parseInt(this.marks_entry_form.value.examid),
      "section_id": parseInt(this.marks_entry_form.value.sectionid),
      "course_id": selectedcourseid

    }
    // console.log(obj)
    this._exam_marks_entry_Service
      .pushtoanalysis(obj)
      .subscribe((data) => {
        // console.log(data)

      })
  }

}
