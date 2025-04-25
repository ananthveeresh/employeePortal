import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ExamMarksEntryService } from "src/app/core/services/exam-marks-entry.service";
import { GradeCalcService } from "src/app/core/services/grade-calc.service";
import { DatePipe } from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CbseTermendService } from 'src/app/core/services/cbse-termend.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-termend-edit-or-update',
  templateUrl: './termend-edit-or-update.component.html',
  styleUrls: ['./termend-edit-or-update.component.css'],
  providers: [DatePipe],

})
export class TermendEditOrUpdateComponent implements OnInit {

  show_form: number = 0;
  exam_id: any;
  section_id: any;
  subject: string;
  logininfo: any;
  exam_Marks_Sub_Entry: any = [];
  section_std_List: any = [];
  logininfo_yr: any;
  cbseterm_data: any = []
  exam_list_filter: any;
  block_one: any;
  block_two: any;
  block_three: any;
  block_four: any;
  exam_Sections_List: any = [];
  classTeacher: any;
  updatedStdList: any[] = [];
  exam_List_Data = [];
  finalgrade: string;
  subInfo: any;
  subjects_data: any;
  instfilter: any;
  grade_scales_list: any;
  final_grades_array: any;
  filterseclist: any;
  totalMarks: number = 0;
  currentDate: any;
  examDate: any;
  totalsubMarks: any;
  loading = false;



  constructor(private router: Router, private route: ActivatedRoute,
    private _exam_marks_entry_Service: ExamMarksEntryService, private _cbsetermendService: CbseTermendService,
    private http: HttpClient, public datepipe: DatePipe, private cdr: ChangeDetectorRef, private location: Location) { }
  ngOnInit() {
    this.exam_id = this.route.snapshot.paramMap.get('exam_id');
    this.section_id = this.route.snapshot.paramMap.get('section_id');
    this.subject = this.route.snapshot.paramMap.get('subject')!.replace(/-/g, '/');

    this.logininfo = localStorage.getItem("logindata");
    this.logininfo = JSON.parse(this.logininfo);
    // console.log(this.logininfo)
    this.logininfo_yr = localStorage.getItem("logindata_yr");
    this.logininfo_yr = JSON.parse(this.logininfo_yr);
    //  console.log(this.logininfo_yr)

    var curDate = new Date();
    this.currentDate = this.datepipe.transform(curDate, "yyyy-MM-dd hh:mm:ss");

    var obj = {
      "campus": this.logininfo.campusName,
      "exam_id": parseInt(this.exam_id),
      "section_id": parseInt(this.section_id),
      "subject": this.subject
    };
    // console.log(preobj)

    this._exam_marks_entry_Service.exam_sub_marks(obj).subscribe((data) => {
      // console.log(data)
      if (data.status == true) {
        this.show_form = 2;
        this.updatedStdList = data.result;
        this.totalsubMarks = this.updatedStdList[0].exam_result.max_marks
        // Applying map function to update the structure
        // this.updatedStdList = this.updatedStdList.map(item => {
        //   const { grade, total, ...restExamResult } = item.exam_result;

        //   return {
        //     ...item,
        //     grade: grade,         // Move grade outside
        //     total: total,         // Move total outside
        //     exam_result: restExamResult // Rest of exam_result remains intact
        //   };
        // }); 
      }
      else {
        this.show_form = 1;
        this.getStdList(this.section_id);

      }
    });

    this._exam_marks_entry_Service
      .exam_sections(this.logininfo.paycode)
      .subscribe((data: any) => {
        //// console.log(data)
        if (data.length > 0) {
          this.exam_Sections_List = data;
        }

        this.filterseclist = this.exam_Sections_List.filter(
          (e: { id: any }) => e.id == this.section_id
        );
        //  console.log(this.filterseclist)
        this.classTeacher = this.filterseclist[0].clteacher
        // console.log(this.classTeacher)

        var obj = {
          campus: this.logininfo.campusName,
          exam_id: this.exam_id,
          section_id: this.section_id,
          paycode: this.logininfo.paycode,
          class_teacher: this.filterseclist[0].clteacher
        };
        // console.log(obj)

        this._exam_marks_entry_Service.marks_entry_create(obj).subscribe((data) => {
          this.subjects_data = data.subjectsData;
          // console.log(this.subjects_data)

        })

      });

    this._exam_marks_entry_Service.inst_master().subscribe((data) => {
      // console.log(data);
      this.instfilter = data.filter(
        (e: { id: any }) => e.id == this.logininfo.instId
      );

      this._exam_marks_entry_Service
        .exam_sections(this.logininfo.paycode)
        .subscribe((data: any) => {
          //  console.log(data)
          var class_filter = data.filter((e: { id: any }) => e.id == this.section_id)
          //  console.log(class_filter[0].course_name)
          var examobj = {
            year_id: this.logininfo_yr[0].year_id,
            section_id: parseInt(this.section_id),
          };
          this._exam_marks_entry_Service.exams_list(examobj).subscribe((data) => {
            // console.log(data);
            this.exam_List_Data = data

            this.exam_list_filter = this.exam_List_Data.filter((e: { examid: any }) => e.examid == this.exam_id);
            //  console.log(this.exam_list_filter)
            var obj = {
              "institute": this.instfilter[0].short_code,
              "exam_category": this.exam_list_filter[0].sub_cat_name,
              "campus": this.logininfo.campusName,
              "grade": class_filter[0].course_name
            };
            // console.log(obj)

            this._cbsetermendService.cbsetermschema(obj).subscribe((data: any) => {
              // console.log(data)
              if (data.length > 0) {
                this.cbseterm_data = data[0]

              }

            });

          });

        });
      var grdobj = {
        "institute": this.instfilter[0].short_code,
        "campus": this.logininfo.campusName
      }
      // console.log(grdobj)
      this._exam_marks_entry_Service.get_gradeby_inst_campus(grdobj).subscribe((data) => {
        // console.log(data);
        this.grade_scales_list = data;
      });

    });
    // this.loading = true;

  }

  getStdList(sec_id: any) {
    var obj = {
      year: this.logininfo_yr[0].year_id,
      section: sec_id,
    };
    this._exam_marks_entry_Service.sec_students(obj).subscribe((data) => {
      this.section_std_List = data;
      //  console.log(this.section_std_List);
      if (this.subject != 'ICT') {
        var block1data = this.cbseterm_data.subject_schema.filter((e: { title: any }) => e.title == "block-1")

      } else {
        var block1data = this.cbseterm_data.subject_schema.filter((e: { title: any }) => e.title == "block-2")
      }
      this.totalsubMarks = block1data[0].max_marks
      // console.log(block1data)
      var exam_result = {
        "subject": this.subject,
        "max_marks": block1data[0].max_marks,
        "min_marks": block1data[0].min_marks,
        "subjects": block1data[0].subjects
      };

      // console.log(exam_result);

      var updatedStdList = [];
      updatedStdList = this.section_std_List.map((student: any) => ({
        ...student,
        exam_result // Now passing the object directly

      }));
      this.loading = true


      this.updatedStdList.push(...updatedStdList);

      // Now updating the inner structure, assuming subjects is an array inside the object
      this.updatedStdList = this.updatedStdList.map(student => ({
        ...student,
        exam_result: {
          ...student.exam_result,
          subjects: student.exam_result.subjects.map((sub: any) => ({ ...sub }))

        }

      }));
      // console.log(this.updatedStdList)

    });
  }

  sortSubjectsByOrder(subjects: any[]): any[] {
    return subjects.sort((a, b) => a.order - b.order);
  }


  updateMarks(studentIndex: number, subjectIndex: number, marksobj: any): void {
    this.finalgrade = "";
    // console.log(marksobj)
    if (marksobj.marks == 'A') {
      this.updatedStdList[studentIndex].total = "Absent";
      this.updatedStdList[studentIndex].grade = "Absent";
    } else {
      marksobj.max_marks = parseFloat(marksobj.max_marks)
      marksobj.marks = parseFloat(marksobj.marks)

      if (marksobj.max_marks < marksobj.marks || isNaN(marksobj.marks)) {
        this.cdr.detectChanges();
        this.updatedStdList[studentIndex].exam_result.subjects[subjectIndex].marks = "";
        this.updatedStdList[studentIndex].total = "";
        this.updatedStdList[studentIndex].grade = "";

        //// console.log("error");
      } else {

        this.finalgrade = "";
        var ttmarks = this.total_calc(this.updatedStdList[studentIndex].exam_result.subjects);
        this.finalgrade = this.grade_calc(ttmarks, this.exam_list_filter[0].sub_cat_name)
        //  console.log('Grade:', this.finalgrade);
        // if (this.finalgrade == "Invalid") {
        //   if (marksobj.marks == "A") {
        //     this.updatedStdList[studentIndex].grade = "Absent";
        //   } else {
        //     this.updatedStdList[studentIndex].grade = "";
        //     this.updatedStdList[studentIndex].exam_result.subjects[subjectIndex].marks = "";
        //     this.updatedStdList[studentIndex].total = "";
        //   }
        // } else {
        this.updatedStdList[studentIndex].grade = this.finalgrade;
        this.updatedStdList[studentIndex].total = ttmarks;
        // }
      }

      // console.log(this.updatedStdList[studentIndex])
      this.updatedStdList[studentIndex].exam_result.subjects[subjectIndex].marks = marksobj.marks;
    }

  }

  updateInsertedMarks(studentIndex: number, subjectIndex: number, marksobj: any): void {
    this.finalgrade = "";
    // console.log(marksobj)
    if (marksobj.marks == 'A') {
      this.updatedStdList[studentIndex].exam_result.total = "Absent";
      this.updatedStdList[studentIndex].exam_result.grade = "Absent";
    } else {
      marksobj.max_marks = parseFloat(marksobj.max_marks)
      marksobj.marks = parseFloat(marksobj.marks)

      if (marksobj.max_marks < marksobj.marks || isNaN(marksobj.marks)) {
        this.cdr.detectChanges();
        this.updatedStdList[studentIndex].exam_result.subjects[subjectIndex].marks = "";
        this.updatedStdList[studentIndex].exam_result.total = "";
        this.updatedStdList[studentIndex].exam_result.grade = "";

        //// console.log("error");
      } else {

        this.finalgrade = "";
        var ttmarks = this.total_calc(this.updatedStdList[studentIndex].exam_result.subjects);
        this.finalgrade = this.grade_calc(ttmarks, this.exam_list_filter[0].sub_cat_name)
        //  console.log('Grade:', this.finalgrade);
        // if (this.finalgrade == "Invalid") {
        //   if (marksobj.marks == "A") {
        //     this.updatedStdList[studentIndex].grade = "Absent";
        //   } else {
        //     this.updatedStdList[studentIndex].grade = "";
        //     this.updatedStdList[studentIndex].exam_result.subjects[subjectIndex].marks = "";
        //     this.updatedStdList[studentIndex].total = "";
        //   }
        // } else {
        this.updatedStdList[studentIndex].exam_result.grade = this.finalgrade;
        this.updatedStdList[studentIndex].exam_result.total = ttmarks;
        // }
      }

    }
    // console.log(this.updatedStdList[studentIndex])
    this.updatedStdList[studentIndex].exam_result.subjects[subjectIndex].marks = marksobj.marks;
    // console.log(this.updatedStdList[studentIndex])
  }


  total_calc(totalarr: any[]): number {
    const sumMarks = totalarr.reduce((sum: number, item: any) => {
      const marks = parseFloat(item.marks) || 0;
      return sum + marks;
    }, 0);

    return sumMarks;
  }
  convertToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  examMarksSubmit() {
    // console.log(this.subjects_data)
    this.subInfo = this.subjects_data.filter(
      (e: { subject: any }) => e.subject == this.subject
    );

    //  console.log(this.subInfo);
    if (confirm("Are You Sure Do You Want to Submit ?")) {
      // //// console.log(this.section_std_List);
      var finalarray = [];
      for (var i = 0; i < this.updatedStdList.length; i++) {

        // console.log(this.updatedStdList[i].grade, this.exam_list_filter)
        if (this.updatedStdList[i].grade != undefined) {
          var obj = {
            exam_type: this.exam_list_filter[0].sub_cat_name,
            exam_id: this.exam_list_filter[0].examid,
            exam_name: this.exam_list_filter[0].exam_name,
            campus: this.updatedStdList[i].campus_name,
            institute: this.exam_list_filter[0].short_code,
            year_id: this.logininfo_yr[0].year_name,
            suc_code: this.updatedStdList[i].student_no,
            student_id: this.updatedStdList[i].std_id,
            student_name: this.updatedStdList[i].student_name,
            section: this.updatedStdList[i].section_name,
            section_id: this.updatedStdList[i].sec_id,
            roll_no: this.updatedStdList[i].roll_no,
            class_name: this.updatedStdList[i].course_name,
            father_name: this.updatedStdList[i].father_name,
            user_id: this.logininfo.paycode,
            user_name: this.logininfo.empName,
            exam_date: this.convertToDDMMYYYY(this.exam_list_filter[0].exam_date),
            exam_result: {
              subject: this.subject,
              grade: this.updatedStdList[i].grade,
              total: this.updatedStdList[i].total,
              max_marks: this.updatedStdList[i].exam_result.max_marks,
              min_marks: this.updatedStdList[i].exam_result.min_marks,
              subjects: this.updatedStdList[i].exam_result.subjects,
              user_name: this.logininfo.empName,
              date: this.currentDate,
            },
          };
          // console.log(obj)
          finalarray.push(obj);
        }

      }
      // console.log(finalarray);
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

  grade_calc(marks: any, exam_cat: string) {
    //  console.log(marks, exam_cat)
    var gradefilter = this.grade_scales_list.filter(
      (e: { exam_category: any }) => e.exam_category == exam_cat
    );
    // console.log(gradefilter)
    var gradetypefilter = gradefilter[0].grade_scale.filter(
      (e: { type: any }) => e.type == "Scholastic"
    );

    // console.log(gradetypefilter)
    marks = parseFloat(marks)
    for (let schema of gradetypefilter[0].grades_range) {
      let [min, max] = schema.marks_range.split('-').map(parseFloat);
      if (marks >= min && marks <= max) {
        return schema.grade;
      }
    }
    return 'Invalid';
  }


  update_sub_marks(subupdate: any) {
    // //// console.log(subupdate);
    var user_id = this.logininfo.paycode;
    var user_name = this.logininfo.empName;

    subupdate = subupdate.map((item: any) => ({
      ...item,
      [user_id]: user_id,
      [user_name]: user_name,
      teacher_name: this.logininfo.empName,
      report_layout: "",
      exam_date: this.convertToDDMMYYYY(this.exam_list_filter[0].exam_date),
      exam_result: {
        ...item.exam_result,
        date: this.currentDate,
        user_name: user_name,
      },
    }));
    // console.log(subupdate);
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


  stddetails(std_info: any, subname: string) {
    // console.log(std_info)

    if (!std_info.sec_id) {
      std_info.sec_id = std_info.section_id
    }
    if (!std_info.std_id) {
      std_info.std_id = std_info.student_id
    }
    this.router.navigate(['/std_exam_additional_details', this.exam_id, std_info.sec_id, std_info.std_id], {
      state: { updatedata: this.updatedStdList }
    });
  }

  stepBack() {
    this.location.back();

  }
}
