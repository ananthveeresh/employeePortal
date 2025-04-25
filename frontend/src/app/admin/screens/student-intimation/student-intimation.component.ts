import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HomeWorkService } from "src/app/core/services/home-work.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-student-intimation",
  templateUrl: "./student-intimation.component.html",
  styleUrls: ["./student-intimation.component.css"],
  providers: [DatePipe],
})
export class StudentIntimationComponent implements OnInit {
  category: "";
  std_list: any = [];
  // selected_hw_list: any = [];
  // selected_section_list: any = {};
  removed_data: any = [];
  logininfo: any = {};
  std_intimation_Form: FormGroup;
  student_status_Form: FormGroup;
  section_List: any;
  currentDate: any;
  student_Status_List: any = [];
  campus_connect_Type: any;
  student_Status_Cat: any;
  selected_dt: any = "";
  selectedCount: number = 0;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private _homeworkService: HomeWorkService,
    private datepipe: DatePipe
  ) {
    var curDate = new Date();
    this.currentDate = this.datepipe.transform(curDate, "yyyy-MM-dd");

    this.std_intimation_Form = this.fb.group({
      category: [""],
      sectionlist: [""],
    });
    this.student_status_Form = this.fb.group({
      selected_dt: [this.currentDate],
    });
  }

  ngOnInit(): void {
    this.logininfo = localStorage.getItem("logindata");
    this.logininfo = JSON.parse(this.logininfo);
    console.log(this.logininfo);

    this._homeworkService
      .section_list(this.logininfo.campusId)
      .subscribe((data: any) => {
        this.section_List = data;
        // // console.log(this.section_List)
      });

    this._homeworkService
      .student_status_list(this.currentDate, this.logininfo.paycode)
      .subscribe((data: any) => {
        this.student_Status_List = data;
        console.log(this.student_Status_List);
        this.campus_connect_Type = unique(
          this.student_Status_List,
          "campus_connect_type"
        );
        this.student_Status_Cat = this.student_Status_List;
        console.log(this.student_Status_Cat);
      });
  }

  selectedDate(date: any) {
    var selected_date = date.target.value;
    this._homeworkService
      .student_status_list(selected_date, this.logininfo.paycode)
      .subscribe((data: any) => {
        this.student_Status_List = data;
        console.log(this.student_Status_List);
        this.campus_connect_Type = unique(
          this.student_Status_List,
          "campus_connect_type"
        );
        console.log(this.campus_connect_Type);
        this.student_Status_Cat = this.student_Status_List;
      });
  }

  get_by_category(data: any) {
    if (data.target.value == "All") {
      this.student_Status_Cat = this.student_Status_List;
      console.log(this.student_Status_Cat);
    } else {
      this.student_Status_Cat = this.student_Status_List.filter(
        (e: { campus_connect_type: any }) =>
          e.campus_connect_type == data.target.value
      );
      console.log(this.student_Status_Cat);
    }
  }

  get_std_list() {
    var obj = {
      year: 21,
      section: this.std_intimation_Form.value.sectionlist,
    };
    // // // console.log(obj)
    this._homeworkService.section_wise_std_list(obj).subscribe((data: any) => {
      // // console.log(data)
      var section_data = data;

      section_data.sort(
        (a: { roll_no: number }, b: { roll_no: number }) =>
          a.roll_no - b.roll_no
      );

      this.std_list = section_data;
      // // // console.log(this.std_list)
    });
    this.loading = true;
  }

  change_status(ind: number) {
    if (this.std_list[ind].status == true) {
      this.std_list[ind].status = false;

      this.removed_data.push(this.std_list[ind]);
      this.selectedCount--;
    } else {
      this.std_list[ind].status = true;
      this.removed_data.pop(this.std_list[ind]);
      this.selectedCount++;
    }
    // this.selectedCount = this.std_list.filter((item: { status: any; }) => item.status).length;

    // // // console.log(this.removed_data)

    // // // console.log(this.std_list)
  }

  onStatus_submit() {
    // // console.log(this.std_list)
    var post_status_array: any = [];
    var today_date = new Date();
    for (var i = 0; i < this.std_list.length; i++) {
      if (this.std_list[i].status) {
        var push_obj = {
          academic_year: this.std_list[i].year_id,
          branch: this.std_list[i].course_name,
          branch_id: this.std_list[i].course_id,
          inst_id: this.logininfo.instId,
          campus_connect_type: this.std_intimation_Form.value.category,
          campus_connect_id: "",
          campus_connect_entry_date: today_date,
          entry_date: today_date,
          std_suc: this.std_list[i].student_no,
          student_name: this.std_list[i].student_name,
          section_name: this.std_list[i].section_name,
          section_id: this.std_list[i].sec_id,
          homework_status: true,
          comment: "",
          staffinfo: this.logininfo,
        };

        post_status_array.push(push_obj);
      }
    }
    console.log(post_status_array);

    this._homeworkService
      .std_intimation_sec_wise_submit(post_status_array)
      .subscribe((data: any) => {
        console.log(data);
        location.reload();
      });
  }
}

function unique(sbjnm: any, arg1: string): any {
  const uniqueValues = [
    ...new Set(sbjnm.map((item: { [x: string]: any }) => item[arg1])),
  ];
  return uniqueValues;
}
