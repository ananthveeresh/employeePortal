import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ExamMarksEntryService } from 'src/app/core/services/exam-marks-entry.service';
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.css']
})
export class ReportCardComponent implements OnInit {
  exam_id: any;
  suc_code: any;
  std_Exam_Result: any = [];
  grade_scales: any = [];
  exam_Sections_List: any = [];
  sec_id: any;
  logininfo: any = {};
  logininfo_yr: any;
  year_Info: any;
  std_attendance: any = [];
  year_master: any = []
  selectedLayoutImage: any = [];
  teacherSignature: any;


  constructor(private fb: FormBuilder, private _exam_marks_entry_Service: ExamMarksEntryService, private router: Router,
    private route: ActivatedRoute,) {

  }

  ngOnInit(): void {
    this.logininfo = localStorage.getItem("logindata");
    this.logininfo = JSON.parse(this.logininfo);
    this.logininfo_yr = localStorage.getItem("logindata_yr");
    this.logininfo_yr = JSON.parse(this.logininfo_yr);
    // console.log(this.logininfo_yr)

    this.exam_id = this.route.snapshot.params["examid"];
    this.suc_code = this.route.snapshot.params["succode"];
    this.sec_id = this.route.snapshot.params["sectionid"];
    this._exam_marks_entry_Service.year_master().subscribe((data) => {
      // console.log(data)
      this.year_master = data

    })

    this._exam_marks_entry_Service.std_exam_result(this.sec_id, this.exam_id, this.suc_code).subscribe((data) => {

      //  console.log(data)
      if (data.status == true) {
        this.std_Exam_Result = data.result[0];
        //  console.log(this.std_Exam_Result)

        this._exam_marks_entry_Service.get_one_layout(this.std_Exam_Result.report_layout).subscribe((data) => {
          //  console.log(data)
          this.selectedLayoutImage = data[0].layout_path + 'img/' + data[0].bg_image;
          // console.log(data[0].signature)
          if (data[0].signature != '' && data[0].signature != undefined) {
            this.teacherSignature = data[0].layout_path + 'img/' + data[0].signature;
            // this.teacherSignature = './assets/img/'+ data[0].signature;
          } else {
            this.teacherSignature = ""
          }
        })


        this.year_Info = this.year_master.filter(
          (e: { year_name: any }) => e.year_name == this.std_Exam_Result.year_id
        );
        var obj = {
          "student_id": this.std_Exam_Result.suc_code,
          "year_id": this.year_Info[0]?.year_id,
          "section_id": this.std_Exam_Result.section_id,
          "attendance_from_date": this.std_Exam_Result.attendance_from_date,
          "attendance_to_date": this.std_Exam_Result.attendance_to_date

        }
        //  console.log(obj)

        this._exam_marks_entry_Service.student_attendance(obj).subscribe((data) => {
          //  console.log(data)
          this.std_attendance = data.result

        });

        //  console.log(this.std_Exam_Result)
        var gradeobj = {
          institute: this.std_Exam_Result.institute,
          exam_category: this.std_Exam_Result.exam_type,
          campus: this.logininfo.campusName
        }
        this._exam_marks_entry_Service.grades_by_examtype(gradeobj).subscribe((data) => {
          this.grade_scales = data[0].grade_scale

        });
        // console.log(this.std_Exam_Result)

      } else {
        console.log("error")
      }

    })

  }

  getmarksrange(grd: string) {
    //  console.log(grd)
    var gradescale = this.grade_scales.filter(

      (e: { grade: any }) =>
        e.grade == grd
    );
    return gradescale[0]?.marks_range

  }

  printDiv(divId: string) {
    let printContents = document.getElementById(divId)?.innerHTML;
    let originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      location.reload(); // Reload to restore the original contents after printing
    } else {
      console.error(`Div with id ${divId} not found.`);
    }
  }

}