import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ExamMarksEntryService } from "src/app/core/services/exam-marks-entry.service";
import { CbseTermendService } from 'src/app/core/services/cbse-termend.service';
import { DatePipe } from "@angular/common";
import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-std-exam-additional-details',
  templateUrl: './std-exam-additional-details.component.html',
  styleUrls: ['./std-exam-additional-details.component.css'],
  providers: [DatePipe],

})
export class StdExamAdditionalDetailsComponent implements OnInit {
  exam_id: any;
  section_id: any;
  subject: string;
  logininfo_yr: any;
  logininfo: any;
  section_std_List: any = [];
  cbseterm_data: any;
  instfilter: any;
  exam_List_Data: any;
  exam_list_filter: any;
  exam_Sections_List: any;
  filterseclist: any;
  classTeacher: any;
  currentDate: any;
  cbse_term_end: any = [];
  Grade: string = '';
  stdinfo: any;
  std_id: any;
  enteredGrade: any
  co_scholastic_info: any = [];
  sutudent_id: number;
  stdname: string;
  block_1_data: any;
  block_0_data: any;
  block_3_data: any;
  block_4_data: any;
  block_5_data: any;
  loading = false;


  constructor(private router: Router, private route: ActivatedRoute,
    private _exam_marks_entry_Service: ExamMarksEntryService, private _cbsetermendService: CbseTermendService, public datepipe: DatePipe, private location: Location, private cdRef: ChangeDetectorRef) {
    this.exam_id = this.route.snapshot.paramMap.get('exam_id');
    this.section_id = this.route.snapshot.paramMap.get('section_id');
    this.std_id = this.route.snapshot.paramMap.get('std_id');
    this.sutudent_id = this.std_id
  }

  ngOnInit(): void {

    this.logininfo = localStorage.getItem("logindata");
    this.logininfo = JSON.parse(this.logininfo);
    // console.log(this.logininfo)
    this.logininfo_yr = localStorage.getItem("logindata_yr");
    this.logininfo_yr = JSON.parse(this.logininfo_yr);
    //  console.log(this.logininfo_yr)
    this.initializeComponent();

  }

  initializeComponent() {
    this.loading = true;
    this.cbse_term_end = []
    this.stdname = '';
    // console.log(this.cbse_term_end,this.stdname)
    // this.stdinfo = [];
    this.co_scholastic_info = []
    // this.cdRef.detectChanges();

    var stdexamobj = {
      campus: this.logininfo.campusName,
      exam_id: parseInt(this.exam_id),
      section_id: parseInt(this.section_id),
      student_id: parseInt(this.std_id)
    }
    // console.log(stdexamobj)
    var obj = {
      year: this.logininfo_yr[0].year_id,
      section: this.section_id,
    };
    this._exam_marks_entry_Service.sec_students(obj).subscribe((data) => {
      // console.log(data)
      this.section_std_List = data;

      this._cbsetermendService.std_exam_info(stdexamobj).subscribe((data) => {
        // console.log(data)

        if (data.result.length > 0) {

          this.stdinfo = data.result
          // console.log(this.stdinfo[0].term_aditional_marks)
          if (this.stdinfo[0].term_aditional_marks.length > 0) {
            this.co_scholastic_info = this.stdinfo[0].term_aditional_marks
          }

        } else {
          this.stdinfo = this.section_std_List.filter(
            (e: { std_id: any }) => e.std_id == this.std_id
          );
          // this.stdinfo[0].exam_result = []

        }
        // console.log(this.stdinfo)
        this.stdname = this.stdinfo[0].student_name;
      })

      this._exam_marks_entry_Service.inst_master().subscribe((data) => {
        // console.log(data);
        this.instfilter = data.filter(
          (e: { id: any }) => e.id == this.logininfo.instId
        );

        this._exam_marks_entry_Service
          .exam_sections(this.logininfo.paycode)
          .subscribe((data1: any) => {
            //  console.log(data1)
            this.exam_Sections_List = data1;
            var class_filter = this.exam_Sections_List.filter((e: { id: any }) => e.id == this.section_id)
            //  console.log(class_filter[0].course_name)
            var examobj = {
              year_id: this.logininfo_yr[0].year_id,
              section_id: parseInt(this.section_id),
            };
            this._exam_marks_entry_Service.exams_list(examobj).subscribe((data2) => {
              // console.log(data2);
              this.exam_List_Data = data2
              this.filterseclist = this.exam_Sections_List.filter(
                (e: { id: any }) => e.id == this.section_id
              );
              //  console.log(this.filterseclist)
              this.classTeacher = this.filterseclist[0].clteacher

              this.exam_list_filter = this.exam_List_Data.filter((e: { examid: any }) => e.examid == this.exam_id);
              //  console.log(this.exam_list_filter)
              var obj = {
                "institute": this.instfilter[0].short_code,
                "exam_category": this.exam_list_filter[0].sub_cat_name,
                "campus": this.logininfo.campusName,
                "grade": class_filter[0].course_name
              };
              // console.log(obj)

              this._cbsetermendService.cbsetermschema(obj).subscribe((data3: any) => {
                // console.log(this.co_scholastic_info)
                if (this.co_scholastic_info.length > 0) {
                  // console.log(this.co_scholastic_info)
                  this.cbse_term_end = this.co_scholastic_info
                } else {
                  this.cbse_term_end = data3[0].subject_schema.filter((e: { title: any }) => e.title != "block-1" && e.title != "block-2");
                  // console.log(this.cbse_term_end)
                }
                // console.log(this.cbse_term_end)
                this.block_0_data = this.cbse_term_end.filter((e: { title: any }) => e.title == "block-0");
                // console.log(this.block_0_data)
                this.loading = false;
                this.block_3_data = this.cbse_term_end.filter((e: { title: any }) => e.title == "block-3");
                this.block_4_data = this.cbse_term_end.filter((e: { title: any }) => e.title == "block-4");
                this.block_5_data = this.cbse_term_end.filter((e: { title: any }) => e.title == "block-5");

              });
            });
          });

      });
    });


    var curDate = new Date();
    this.currentDate = this.datepipe.transform(curDate, "yyyy-MM-dd hh:mm:ss");
  }


  studentdata(stdid: number) {

    // console.log('Selected student ID:', stdid);
    this.router.navigate(
      ['/std_exam_additional_details', this.exam_id, this.section_id, stdid],
      { replaceUrl: true }
    );
    this.std_id = stdid;
    this.sutudent_id = stdid
    this.initializeComponent();  // Ensure re-initialization
  }

  // Step back to the previous student
  prevStudent() {
    const currentIndex = this.section_std_List.findIndex((student: any) => student.std_id === this.std_id);
    if (currentIndex > 0) {
      const previousStudent = this.section_std_List[currentIndex - 1];
      this.studentdata(previousStudent.std_id);
    }
  }

  // Step forward to the next student
  nextStudent() {
    const currentIndex = this.section_std_List.findIndex((student: any) => student.std_id === this.std_id);
    if (currentIndex < this.section_std_List.length - 1) {
      const nextStudent = this.section_std_List[currentIndex + 1];
      this.studentdata(nextStudent.std_id);
    }
  }

  updateMarks(index: number, subject: any) {
    const enteredMarks = Number(subject.marks);

    if (enteredMarks > subject.max_marks) {
      subject.marks = null;
      // console.log(`${subject.sub_titile}`);
    } else {
      // console.log(` ${enteredMarks}`);
    }
  }

  captureGrade(index: number, subject: any, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.enteredGrade = inputElement.value.toUpperCase();

    subject.grade = this.enteredGrade;

    // console.log(`Grade for subject ${subject.sub_titile} (Index: ${index}) is:`, subject.grade);
  }

  convertToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  examMarksSubmit() {
    // console.log(this.cbse_term_end)
    if (confirm("Are You Sure Do You Want to Submit ?")) {
      var cbsefilter0 = this.cbse_term_end.filter(
        (e: { title: any }) => e.title == "block-0"
      );

      var cbsefilter5 = this.cbse_term_end.filter(
        (e: { title: any }) => e.title == "block-5"
      );
      // console.log(cbsefilter5)

      var cbsefilter3 = this.cbse_term_end.filter(
        (e: { title: any }) => e.title == "block-3"
      );
      // console.log(cbsefilter3)

      var cbsefilter4 = this.cbse_term_end.filter(
        (e: { title: any }) => e.title == "block-4"
      );

      if (!this.stdinfo[0].campus_name) {
        this.stdinfo[0].campus_name = this.stdinfo[0].campus
      }
      if (!this.stdinfo[0].course_name) {
        this.stdinfo[0].course_name = this.stdinfo[0].class_name
      }
      if (!this.stdinfo[0].section_name) {
        this.stdinfo[0].section_name = this.stdinfo[0].section
      }
      if (!this.stdinfo[0].sec_id) {
        this.stdinfo[0].sec_id = this.stdinfo[0].section_id
      }
      if (!this.stdinfo[0].std_id) {
        this.stdinfo[0].std_id = this.stdinfo[0].student_id
      }
      if (!this.stdinfo[0].student_no) {
        this.stdinfo[0].student_no = this.stdinfo[0].suc_code
      }
      var finalarr =
      {
        exam_type: this.exam_list_filter[0].sub_cat_name,
        exam_id: this.exam_list_filter[0].examid,
        exam_name: this.exam_list_filter[0].exam_name,
        campus: this.stdinfo[0].campus_name,
        institute: this.exam_list_filter[0].short_code,
        year_id: this.logininfo_yr[0].year_name,
        suc_code: this.stdinfo[0].student_no,
        student_id: this.stdinfo[0].std_id,
        student_name: this.stdinfo[0].student_name,
        section: this.stdinfo[0].section_name,
        section_id: this.stdinfo[0].sec_id,
        roll_no: this.stdinfo[0].roll_no,
        class_name: this.stdinfo[0].course_name,
        father_name: this.stdinfo[0].father_name,
        user_id: this.logininfo.paycode,
        user_name: this.logininfo.empName,
        exam_date: this.convertToDDMMYYYY(this.exam_list_filter[0].exam_date),
        term_aditional_marks: [cbsefilter0[0], cbsefilter3[0], cbsefilter4[0], cbsefilter5[0]],
        // exam_result: this.stdinfo[0].exam_result,
        // std_aditional_info :{
        //   healthinfo: cbsefilter0[0].subjects,
        //   comment: cbsefilter5[0].subjects[0].col_value
        // }
      }
      //  console.log(finalarr)
      this._cbsetermendService
        .insert_scholastic(finalarr)
        .subscribe((data) => {
          //  console.log(data);
          // if (data.status == true) {

          alert("Submitted successfully");
          this.loading = true;
          this.nextStudent()
          // location.reload();
          // }
        });
    }
  }
  stepBack() {
    window.history.go(-1);

  }

}
