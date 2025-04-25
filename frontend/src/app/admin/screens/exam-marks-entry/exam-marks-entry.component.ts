import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ExamMarksEntryService } from "src/app/core/services/exam-marks-entry.service";
import { GradeCalcService } from "src/app/core/services/grade-calc.service";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { DatePipe } from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { empportalApi } from 'src/environments/environment.development';


@Component({
  selector: "app-exam-marks-entry",
  templateUrl: "./exam-marks-entry.component.html",
  styleUrls: ["./exam-marks-entry.component.css"],
  providers: [DatePipe],
})
export class ExamMarksEntryComponent implements OnInit {
  marks_entry_form: FormGroup;
  report_generate_Form: FormGroup;
  logininfo: any = {};
  logininfo_yr: any;
  exam_Sections_List: any = [];
  exam_List_Data: any = [];
  exams_Section_Subs: any = [];
  sec_Id: any;
  section_std_List: any = [];
  subInfo: any;
  selected_exam_Id: any;
  exam_list_filter: any;
  exam_Marks_Sub_Entry: any = [];
  secInfo: any;
  show_form = 0;
  msg = "";
  loading = false;
  generate_Report_Card: any = [];
  err_msg: any;
  section_id: any;
  currentDate: any;
  marks_Entry_create: any = [];
  subject_name: any;
  exam_id: number;
  marks_entry_result: any;
  subjects_data: any;
  employee_Data: any = [];
  layout_Type: any = [];
  examDate: any;
  selectedLayoutImage: string | null = null;
  isModalOpen: boolean = false;
  pdf_success_msg: string = "";
  submit_res_form = 0
  classTeacher: any;
  exam_subjects: any = [];
  mapped_subjects: any = [];
  grade_scales_list: any = [];
  final_grades_array: any;
  finalgrade: string;


  constructor(
    private fb: FormBuilder,
    private _exam_marks_entry_Service: ExamMarksEntryService,
    private _GradeCalcService: GradeCalcService,
    public datepipe: DatePipe, private http: HttpClient,
  ) {
    this.marks_entry_form = this.fb.group({
      sectionid: [""],
      examid: [""],
    });

    var curDate = new Date();
    this.currentDate = this.datepipe.transform(curDate, "yyyy-MM-dd hh:mm:ss");
  }

  ngOnInit(): void {

    this.logininfo = localStorage.getItem("logindata");
    this.logininfo = JSON.parse(this.logininfo);
    this.logininfo_yr = localStorage.getItem("logindata_yr");
    this.logininfo_yr = JSON.parse(this.logininfo_yr);
    //  console.log(this.logininfo);
    //  console.log(this.logininfo_yr);
    this.report_generate_Form = this.fb.group({
      reportlayout: [""],
      // teachername: [this.logininfo.empName],
      fromDate: [""],
      toDate: [""]
    });
    this._exam_marks_entry_Service
      .exam_sections(this.logininfo.paycode)
      .subscribe((data: any) => {
        // console.log(data)
        if (data.length > 0) {
          this.exam_Sections_List = data;
        }
      });
    this._exam_marks_entry_Service.inst_master().subscribe((data) => {
      // console.log(data);
      var instfilter = data.filter(
        (e: { id: any }) => e.id == this.logininfo.instId
      );
      var grdobj = {
        "institute": instfilter[0].short_code,
        "campus": this.logininfo.campusName
      }
      this._exam_marks_entry_Service.get_gradeby_inst_campus(grdobj).subscribe((data) => {
        // console.log(data);
        this.grade_scales_list = data;
      });
    });
  }

  layout_filter(layout: any) {
    // console.log(layout.target.value)
    var filterseclist = this.layout_Type.filter(
      (e: { layout_name: any }) => e.layout_name == layout.target.value
    );
    this.selectedLayoutImage = filterseclist[0].layout_path + 'img/' + filterseclist[0].priview_image;
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  getExams(section_id: any) {
    this.marks_entry_form.controls["examid"].setValue("");
    this.generate_Report_Card = [];
    this.exam_Marks_Sub_Entry = [];
    this.section_std_List = [];
    this.exam_List_Data = [];
    this.subjects_data = [];
    this.show_form = 0;
    this.submit_res_form = 0;
    this.employee_Data = []
    this.layout_Type = []
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
        this.examDate = this.exam_List_Data[0].exam_date;
      } else {
        this.exam_List_Data = [];
        this.section_std_List = [];
        this.exam_Marks_Sub_Entry = [];
        this.marks_entry_form.controls["examid"].setValue("");
      }
    });

  }

  getStdList(sec_id: any) {
    var obj = {
      year: this.logininfo_yr[0].year_id,
      section: sec_id,
    };
    this._exam_marks_entry_Service.sec_students(obj).subscribe((data) => {
      this.show_form = 1;
      this.section_std_List = data;
      // console.log(this.section_std_List);
    });
  }

  verifyMarks(marks: any, idx: any) {
    // //// console.log(this.section_std_List)
    // //// console.log(this.section_std_List[idx].grade)
    this.finalgrade = "";
    this.subInfo = this.subjects_data.filter(
      (e: { subject: any }) => e.subject == this.subject_name
    );
    if (marks === null || marks === "") {
      this.section_std_List[idx].grade = "";
      return;
    }
    this.exam_list_filter = this.exam_List_Data.filter(
      (e: { examid: any }) => e.examid == this.exam_id
    );

    if (this.subInfo[0].max_marks < marks) {
      this.section_std_List[idx].marks = "";
      this.section_std_List[idx].grade = "";
      //// console.log("error");
    } else {
      this.finalgrade = "";
      this.finalgrade = this.grade_calc(marks, this.exam_list_filter[0].sub_cat_name)
      // // console.log('Grade:', this.finalgrade);
      if (this.finalgrade == "Invalid") {
        if (marks == "A") {
          this.section_std_List[idx].grade = "Absent";
        } else {
          this.section_std_List[idx].grade = "";
          this.section_std_List[idx].marks = "";
        }
      } else {
        this.section_std_List[idx].grade = this.finalgrade;
      }
    }
  }
  grade_calc(marks: any, exam_cat: string) {
    var gradefilter = this.grade_scales_list.filter(
      (e: { exam_category: any }) => e.exam_category == exam_cat
    );

    this.final_grades_array = gradefilter[0]?.grade_scale
    // console.log(this.final_grades_array)
    for (let schema of this.final_grades_array) {
      let [min, max] = schema.marks_range.split('-').map(parseFloat);
      if (marks >= min && marks <= max) {
        return schema.grade;
      }
    }
    return 'Invalid';
  }

  marks_entry_create() {
    var exam_id = this.marks_entry_form.value.examid;
    var section_id = this.marks_entry_form.value.sectionid;
    this.pdf_success_msg = "";
    var filterseclist = this.exam_Sections_List.filter(
      (e: { id: any }) => e.id == section_id
    );
    this.classTeacher = filterseclist[0].clteacher
    var obj = {
      campus: this.logininfo.campusName,
      exam_id: exam_id,
      section_id: section_id,
      paycode: this.logininfo.paycode,
      class_teacher: filterseclist[0].clteacher
    };
    this._exam_marks_entry_Service.marks_entry_create(obj).subscribe((data) => {
      // console.log(data);
      if (data.result.length > 0) {
        this.show_form = 3;
        this.submit_res_form = 0;
        this.employee_Data = []
        this.layout_Type = []
        this.generate_Report_Card = data.result;
        this.pdf_success_msg = ""
        //// console.log(this.generate_Report_Card)
      } else {
        //// console.log(data)
        this.show_form = 0;
        this.exam_subjects = data.examSubjects
        this.mapped_subjects = data.subjectsData
        if (data.msg == "Marks Submitted" && data.examSubjects.length == data.subjectsData.length) {
          this.submit_res_form = 1;
          this._exam_marks_entry_Service
            .class_teachers(section_id)
            .subscribe((data: any) => {
              if (data.length > 0) {
                this.employee_Data = data;
                // console.log(this.employee_Data)
                // const classTeacher = this.report_generate_Form.get('teachername');
                // if (classTeacher && this.employee_Data.length > 0) {
                //   classTeacher.setValue(this.employee_Data[0].empname);
                // }
              }
              //  else {
              //   // console.log('Class teacher not mapped')
              // }

            });

          this._exam_marks_entry_Service.layout_type().subscribe((data: any) => {
            // console.log(data)
            this.layout_Type = data;
            // this.report_generate_Form.value.reportlayout = this.layout_Type[0].bg_image;
            const reportLayoutControl = this.report_generate_Form.get('reportlayout');
            if (reportLayoutControl && this.layout_Type.length > 0) {
              reportLayoutControl.setValue(this.layout_Type[0].layout_name);
            }
            // console.log(this.layout_Type[0].layout_path+'img/'+this.layout_Type[0].priview_image)
            this.selectedLayoutImage = this.layout_Type[0].layout_path + 'img/' + this.layout_Type[0].priview_image;
          });
        } else {
          this.generate_Report_Card = []
        }

        this.marks_entry_result = data;
        this.subjects_data = data.subjectsData;
        // console.log(this.subjects_data);
      }
    });
  }

  examMarksSubmit() {
    // //// console.log(this.subInfo);
    if (confirm("Are You Sure Do You Want to Submit ?")) {
      // //// console.log(this.section_std_List);
      var finalarray = [];
      for (var i = 0; i < this.section_std_List.length; i++) {
        var obj = {
          exam_type: this.exam_list_filter[0].sub_cat_name,
          exam_id: this.exam_list_filter[0].examid,
          exam_name: this.exam_list_filter[0].exam_name,
          campus: this.section_std_List[i].campus_name,
          institute: this.exam_list_filter[0].short_code,
          year_id: this.logininfo_yr[0].year_name,
          suc_code: this.section_std_List[i].student_no,
          student_id: this.section_std_List[i].std_id,
          student_name: this.section_std_List[i].student_name,
          section: this.section_std_List[i].section_name,
          section_id: this.section_std_List[i].sec_id,
          roll_no: this.section_std_List[i].roll_no,
          class_name: this.section_std_List[i].course_name,
          father_name: this.section_std_List[i].father_name,
          user_id: this.logininfo.paycode,
          user_name: this.logininfo.empName,
          exam_date: this.exam_List_Data[0].exam_date,
          exam_result: {
            subject: this.subInfo[0].subject,

            max_marks: this.subInfo[0].max_marks,
            min_marks: this.subInfo[0].min_marks,
            marks: this.section_std_List[i].marks,
            grade: this.section_std_List[i].grade,

            user_name: this.logininfo.empName,
            date: this.currentDate,
          },
        };
        finalarray.push(obj);
      }
      // //// console.log(finalarray);
      this._exam_marks_entry_Service
        .exam_marks_sub_entry(finalarray)
        .subscribe((data) => {
          // console.log(data);
          if (data.status == true) {
            this.section_std_List = data;

            alert("Submitted successfully");
            this.loading = true;
            location.reload();
          }
        });
    }
  }

  verifyMarksinSubj(marks: any, idx: any) {
    // //// console.log(this.exam_Marks_Sub_Entry[idx].exam_result.grade)
    this.finalgrade = "";
    this.subInfo = this.subjects_data.filter(
      (e: { subject: any }) => e.subject == this.subject_name
    );
    if (marks === null || marks === "") {
      this.exam_Marks_Sub_Entry[idx].exam_result.grade = "";
      return;
    }
    this.exam_list_filter = this.exam_List_Data.filter(
      (e: { examid: any }) => e.examid == this.exam_id
    );
    // //// console.log(this.exam_list_filter)
    if (this.subInfo[0].max_marks < marks) {
      this.exam_Marks_Sub_Entry[idx].exam_result.marks = "";
      this.exam_Marks_Sub_Entry[idx].exam_result.grade = "";
      //// console.log("error");
    } else {
      this.finalgrade = "";
      this.finalgrade = this.grade_calc(marks, this.exam_list_filter[0].sub_cat_name)
      // //// console.log('Grade:', grade);
      if (this.finalgrade == "Invalid") {
        if (marks == "A") {
          this.exam_Marks_Sub_Entry[idx].exam_result.grade = "Absent";
        } else {
          this.exam_Marks_Sub_Entry[idx].exam_result.grade = "";
          this.exam_Marks_Sub_Entry[idx].exam_result.marks = "";
        }
      } else {
        this.exam_Marks_Sub_Entry[idx].exam_result.grade = this.finalgrade;
      }

    }
  }

  update_sub_marks(subupdate: any) {
    // //// console.log(subupdate);
    var user_id = this.logininfo.paycode;
    var user_name = this.logininfo.empName;

    var formattedExamDate = this.datepipe.transform(
      this.examDate,
      "dd-MM-yyyy"
    );
    subupdate = subupdate.map((item: any) => ({
      ...item,
      [user_id]: user_id,
      [user_name]: user_name,
      teacher_name: this.logininfo.empName,
      report_layout: "",
      exam_date: formattedExamDate,
      exam_result: {
        ...item.exam_result,
        date: this.currentDate,
        user_name: user_name,
      },
    }));
    // //// console.log(subupdate);
    if (confirm("Are You Sure Do You Want to Update ?")) {
      this._exam_marks_entry_Service
        .exam_marks_sub_entry(subupdate)
        .subscribe((data) => {
          // //// console.log(data);
          if (data.status == true) {
            this.section_std_List = data;
            // //// console.log(this.section_std_List)
            alert("updated sucessfully");
            this.loading = true;
            location.reload();
          }
        });
    }
  }

  SubmitMarks(obj: any) {
    // //// console.log(obj);
    this.submit_res_form = 0;
    // this.employee_Data = []
    // this.layout_Type = []
    var section_id = parseInt(obj.section_id);
    this.subject_name = obj.subject;
    this.exam_id = parseInt(obj.exam_id);
    var preobj = {
      campus: obj.campus,
      exam_id: this.exam_id,
      section_id,
      subject: this.subject_name,
    };
    this._exam_marks_entry_Service.exam_sub_marks(preobj).subscribe((data) => {
      // //// console.log(data);
      if (data.status == true) {
        this.show_form = 2;
        this.exam_Marks_Sub_Entry = data.result;
      } else {
        this.getStdList(section_id);
      }
    });
  }

  finalresult(examid: any, secid: any) {

    this.loading = true

    var ressection = this.exam_Sections_List.filter(
      (e: { id: any }) => e.id == secid
    );
    var filterseclist = this.layout_Type.filter(
      (e: { layout_name: any }) => e.layout_name == this.report_generate_Form.value.reportlayout
    );
    this.section_id = ressection[0].id;
    var obj = {
      campus: this.logininfo.campusName,
      exam_id: examid,
      year_id: this.logininfo_yr[0].year_name,
      section: ressection[0].section_name,
      user_name: this.logininfo.empName,
      user_id: this.logininfo.paycode,
      teacher_name: this.employee_Data[0].empname,
      report_layout: filterseclist[0].layout_name,
      attendance_from_date: this.report_generate_Form.value.fromDate,
      attendance_to_date: this.report_generate_Form.value.toDate
    };
    // console.log(obj)


    this.err_msg = "";
    this._exam_marks_entry_Service
      .generate_report_card(obj)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      )
      .subscribe(
        (data) => {
          // //// console.log(data);
          this.loading = false
          if (data.status === true) {
            this.subjects_data = [];
            this.submit_res_form = 0;
            this.generate_Report_Card = data.result;
            //  console.log(this.generate_Report_Card)
            this.pdf_success_msg = "Your progress report will be generated shortly. Please refresh the page after few minutes."
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
            setTimeout(() => {
              location.reload();
            }, 5000);

          } else if (data.status === false) {
            this.err_msg = data.msg;
          }
        },
        (error) => {
          // console.log(error);
          this.err_msg = error.error.msg;
        }
      );
  }

  get_pdf(obj: any) {
    // const folderpath = "/" + obj.year_id + "/" + obj.campus + "/" + obj.exam_id;
    const data = {
      "filename": obj.file_name + ".pdf",
      "uploadPath": obj.file_path
    };
    //  console.log(data);

    this.http.post(empportalApi + "/exammarks/downloadpdf", data, { responseType: 'blob' }).subscribe(blob => {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = data.filename;
      link.click();
      URL.revokeObjectURL(blobUrl);
    }, error => {
      console.error('Download error:', error);
    });

  }

  stepBack() {
    if (this.exam_subjects.length == this.mapped_subjects.length) {
      this.show_form = 0
      this.submit_res_form = 1
    } else {
      this.show_form = 0

    }
  }
}
