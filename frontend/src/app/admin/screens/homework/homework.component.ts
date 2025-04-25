import { Component, OnInit } from "@angular/core";
import { HomeWorkService } from "src/app/core/services/home-work.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";

@Component({
  selector: "app-homework",
  templateUrl: "./homework.component.html",
  styleUrls: ["./homework.component.css"],
  providers: [DatePipe],
})
export class HomeworkComponent implements OnInit {
  section_List: any;
  subject_List: any;
  homeworkData: FormGroup;
  logininfo: any = {};
  uploaded_info: any;
  currentDate: any;
  todayDate: any;
  homework_List_by_Date: any;
  hwinfoview: any = [];
  imageData: any;
  selected_file_id: any;
  selectedfiletype: any;
  safeUrl: SafeResourceUrl;
  homework_List_Delete_by_ID: any;
  formVisible = 0;
  event_category_List: any;
  selected_category: any = [];
  category_list: any;
  final_homework_list: any = [];
  history_list: any = [];
  show_history = 0;
  total_home_work_list: any;
  std_list: any = [];
  selected_hw_list: any = [];
  selected_section_list: any = {};
  removed_data: any = [];
  show_accordation: number | null;
  sectionsVisible: boolean = false;
  hmwork_Notify_List: any = {};
  checked_notifications: any = [];
  yearinfo:any=[];

  constructor(
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private _homeworkService: HomeWorkService,

    public datepipe: DatePipe,
    private _http: HttpClient
  ) {
    var curDate = new Date();
    this.currentDate = this.datepipe.transform(curDate, "yyyy-MM-dd");

    this.homeworkData = this.fb.group({
      selectedDate: [this.currentDate],
      sectionlist: ["", [Validators.required]],
      subjectslist: [""],
      homework_desc: ["", [Validators.required]],
      category: ["", [Validators.required]],
      sendNotify: [""],
    });
  }

  ngOnInit(): void {
    this.logininfo = localStorage.getItem("logindata");
    this.logininfo = JSON.parse(this.logininfo);
    // console.log(this.logininfo);
    var curDate = new Date();
    this.todayDate = this.datepipe.transform(curDate, "yyyy-MM-dd");

    this._homeworkService.homework_list_total().subscribe((data: any) => {
      this.total_home_work_list = data;
      //  // console.log(this.total_home_work_list);
      var filteredData = this.total_home_work_list.filter(
        (item: { faculty_info: { paycode: any } }) =>
          item.faculty_info.paycode === this.logininfo.paycode
      );

      this.homework_List_by_Date = filteredData;
      //  // console.log(this.homework_List_by_Date)

      if (filteredData.length > 0) {
        this.homework_List_by_Date.sort(
          (
            a: { createdAt: string | number | Date },
            b: { createdAt: string | number | Date }
          ) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        this.final_homework_list = this.homework_List_by_Date;
        // console.log(this.final_homework_list)
        this.category_list = unique(
          this.homework_List_by_Date,
          "category_info"
        );
        // console.log(this.category_list)
      }
    });


    this.yearinfo = localStorage.getItem("logindata_yr");
    this.yearinfo = JSON.parse(this.yearinfo);
    console.log(this.yearinfo[0].year_id)

    var obj={
      "yearid" : this.yearinfo[0].year_id,
      "campusid" : this.logininfo.campusId
    }
    this._homeworkService
      .section_list(obj)
      .subscribe((data: any) => {
        // // console.log(data)
        this.section_List = data;
      });

    this._homeworkService.event_category_list().subscribe((data: any) => {
      this.event_category_List = data;
      //  // console.log(this.event_category_List)
    });

    this._homeworkService.homework_notify().subscribe((data: any) => {
      this.hmwork_Notify_List = data;
      // // console.log(this.hmwork_Notify_List)
    });
  }

  get_notify(data: any, dt_event: any) {
    // console.log(dt_event.target.checked)
    // // console.log(data)
    if (dt_event.target.checked) {
      this.checked_notifications.push(data);
    } else {
      const index = this.checked_notifications.findIndex(
        (x: { _id: any }) => x._id === data._id
      );
      if (index > -1) {
        this.checked_notifications.splice(index, 1);
      }
    }
    // // console.log(this.checked_notifications)
  }

  get_by_category(data: any) {
    if (data.target.value == "All") {
      this.homework_List_by_Date = this.final_homework_list;
    } else {
      this.homework_List_by_Date = this.final_homework_list.filter(
        (e: { category_info: any }) => e.category_info == data.target.value
      );
    }
  }

  totallist(date: any) {
    var selectedDt = date.target.value;
    selectedDt = new Date(selectedDt);

    var total_data = this.total_home_work_list.filter(
      (e: { createdAt: string }) => {
        // Extract year, month, and day from createdAt date
        const createdAtDate = new Date(e.createdAt);
        const createdAtDay = createdAtDate.getDate();

        // Extract year, month, and day from today's date
        const todayDay = selectedDt.getDate();

        // Compare year, month, and day parts to filter out today's items
        return createdAtDay === todayDay;
      }
    );
    // // console.log(total_data)

    var filteredData = total_data.filter(
      (item: { faculty_info: { paycode: any } }) =>
        item.faculty_info.paycode === this.logininfo.paycode
    );
    filteredData.sort(
      (
        a: { createdAt: string | number | Date },
        b: { createdAt: string | number | Date }
      ) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    this.homework_List_by_Date = filteredData;
    console.log(this.homework_List_by_Date)

    this.final_homework_list = this.homework_List_by_Date;
    this.category_list = unique(this.homework_List_by_Date, "category_info");
    console.log(this.category_list)
  }

  get_std_list(sec_dt: any, hw_dt: any) {
    this.std_list = [];
    this.selected_hw_list = [];
    this.selected_section_list = {};
    var obj = {
      year: 21,
      section: sec_dt.id,
    };
    // // console.log(obj)
    this._homeworkService.section_wise_std_list(obj).subscribe((data: any) => {
      // console.log(data)
      var section_data = data;

      for (var i = 0; i < section_data.length; i++) {
        section_data[i].status = true;
      }

      this._homeworkService
        .section_wise_status_list()
        .subscribe((data1: any) => {
          // console.log(data1)
          for (var i = 0; i < section_data.length; i++) {
            var filtered_data = data1.filter(
              (e: { std_suc: any; campus_connect_id: any }) =>
                e.std_suc == section_data[i].student_no &&
                e.campus_connect_id == hw_dt._id
            );
            // // console.log(filtered_data)
            if (filtered_data.length > 0) {
              section_data[i].status = filtered_data[0].homework_status;
            }
          }
        });

      section_data.sort(
        (a: { roll_no: number }, b: { roll_no: number }) =>
          a.roll_no - b.roll_no
      );

      this.std_list = section_data;
      // // console.log(this.std_list)
      this.selected_hw_list = hw_dt;
      this.selected_section_list = sec_dt;
    });
  }

  onStatus_submit() {
    // console.log(this.std_list)
    var post_status_array: any = [];
    var post_remove_status_array: any = [];
    var today_date = new Date();
    for (var i = 0; i < this.std_list.length; i++) {
      if (this.std_list[i].status) {
        var push_obj = {
          academic_year: this.std_list[i].year_id,
          branch: this.std_list[i].course_name,
          branch_id: this.std_list[i].course_id,
          inst_id: this.logininfo.instId,
          campus_connect_type: this.selected_hw_list.category_info,
          campus_connect_id: this.selected_hw_list._id,
          campus_connect_entry_date: this.selected_hw_list.createdAt,
          entry_date: today_date,
          std_suc: this.std_list[i].student_no,
          student_name: this.std_list[i].student_name,
          section_name: this.std_list[i].section_name,
          section_id: this.std_list[i].sec_id,
          homework_status: true,
          comment: "",
        };
        post_status_array.push(push_obj);
      }
    }
    // // console.log(post_status_array)

    // // console.log(this.removed_data)
    for (var i = 0; i < this.removed_data.length; i++) {
      var push_obj = {
        academic_year: this.removed_data[i].year_id,
        branch: this.removed_data[i].course_name,
        branch_id: this.removed_data[i].course_id,
        inst_id: this.logininfo.instId,
        campus_connect_type: this.selected_hw_list.category_info,
        campus_connect_id: this.selected_hw_list._id,
        campus_connect_entry_date: this.selected_hw_list.createdAt,
        entry_date: today_date,
        std_suc: this.removed_data[i].student_no,
        student_name: this.removed_data[i].student_name,
        section_name: this.removed_data[i].section_name,
        section_id: this.removed_data[i].sec_id,
        homework_status: false,
        comment: "",
      };
      post_remove_status_array.push(push_obj);
    }

    // // console.log(post_remove_status_array)
    const mergedArray = post_status_array.concat(post_remove_status_array);

    // console.log(mergedArray)
    this._homeworkService
      .section_wise_status_submit(mergedArray)
      .subscribe((data: any) => {
        // // console.log(data)

        for (var i = 0; i < this.selected_hw_list.section_info.length; i++) {
          if (
            this.selected_hw_list.section_info[i].id ==
            this.selected_section_list.id
          ) {
            this.selected_hw_list.section_info[i].updated = true;
          }
        }
        this._homeworkService
          .homework_list_update(
            this.selected_hw_list._id,
            this.selected_hw_list
          )
          .subscribe((response: any) => {
            // console.log(this.removed_data.length)
            alert("Data Submitted Successfully..!");
            location.reload();
          });
      });
  }

  change_status(ind: number) {
    if (this.std_list[ind].status == true) {
      this.std_list[ind].status = false;

      this.removed_data.push(this.std_list[ind]);
    } else {
      this.std_list[ind].status = true;
      this.removed_data.pop(this.std_list[ind]);
    }
    // // console.log(this.removed_data)

    // // console.log(this.std_list)
  }

  toggleSections(ind: number) {
    if (this.show_accordation === ind) {
      this.show_accordation = null; 
    } else {
      this.show_accordation = ind; 
    }
  }

  closeaccordation(idx: any) {
    this.sectionsVisible = !this.sectionsVisible;
    this.show_accordation = idx;
  }

  getSubjects() {
    var sectionid = this.homeworkData.value.sectionlist[0].sec_id;
    // // console.log(sectionid)
    this._homeworkService.subject_list(sectionid).subscribe((data: any) => {
      this.subject_List = data;
      // // console.log(this.subject_List);
    });
  }

  insertTag(tag: string): void {
    const textarea = document.getElementById("quesdesp") as HTMLTextAreaElement;
    this.insertTagIntoTextarea(textarea, tag);
  }

  insertTagIntoTextarea(textarea: HTMLTextAreaElement, tag: string): void {
    if (!textarea) return;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const selectedText = textarea.value.substring(startPos, endPos);
    const replacement = tag + selectedText + "</" + tag.substring(1);
    textarea.value =
      textarea.value.substring(0, startPos) +
      replacement +
      textarea.value.substring(endPos);
    textarea.selectionStart = startPos + tag.length;
    this.homeworkData.patchValue({
      homework_desc: textarea.value,
    });
    textarea.selectionEnd = endPos + tag.length;
    textarea.focus();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const path = "/analysis/homeworks/";

    this._homeworkService.uploadFile(file, path).subscribe(
      (response) => {
        // console.log(response);
        this.uploaded_info = response;
      },
      (error) => {
        console.error("Failed to upload file:", error);
      }
    );
  }

  load_image(filedata: any) {
    this.get_image(filedata);
  }

  get_image(file_data: any) {
    const token = "9cf742e6-4d25-4b73-acfe-648911a804e8";
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);

    this.selectedfiletype = file_data.filetype;

    const url =
      "https://apis.aditya.ac.in/filevault/download/" + file_data.filepath;

    this._http.get(url, { headers, responseType: "blob" }).subscribe(
      (data: Blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(data);

        // console.log(file_data)
        // console.log(this.selectedfiletype)
        link.download = file_data.filename;

        link.click();

        window.URL.revokeObjectURL(link.href);
      },
      (error: HttpErrorResponse) => {
        console.error("Error downloading image:", error);
      }
    );
  }

  filter_sub() {
    // // console.log(this.homeworkData.value.category)
    if (this.homeworkData.value.category != "") {
      this.homeworkData.patchValue({
        sectionlist: "",
        subjectslist: "",
      });
      this.subject_List = [];
      var filtered_data = this.event_category_List.filter(
        (e: { categoryname: any }) =>
          e.categoryname == this.homeworkData.value.category
      );
      this.selected_category = filtered_data;
      // // console.log(this.selected_category)
    } else {
      this.homeworkData.patchValue({
        sectionlist: "",
        subjectslist: "",
      });
      this.subject_List = [];
    }
  }

  viewhomework(hwinfo: any) {
    // // console.log(hwinfo);
    this.imageData = null;
    this.hwinfoview = hwinfo;
    this.selected_file_id = hwinfo.filepath;
  }

  deletehomework(id: any) {
    if (confirm("Are You Sure Do You Want to Delete ?")) {
      this._homeworkService
        .homework_list_delete_by_id(id)
        .subscribe((data: any) => {
          // // console.log(data)
          this.homework_List_Delete_by_ID = data;
          // // console.log(this.homework_List_Delete_by_ID)
          alert("Deleted successfully");
          location.reload();
        });
    }
  }

  addhmwork() {
    this.formVisible = 1;
  }

  home_work_List() {
    this.formVisible = 0;
    location.reload();
  }

  filterByTodayDate(jsonData: any) {
    const today = new Date(); 
    const todayDateString = today.toISOString().split("T")[0]; // Format today's date as "YYYY-MM-DD"

    const filteredData: any[] = [];

    jsonData.forEach((item: { createdAt: string | number | Date }) => {
      const createdAtDate = new Date(item.createdAt); // Convert createdAt date string to a Date object
      const createdAtDateString = createdAtDate.toISOString().split("T")[0]; // Format createdAt date as "YYYY-MM-DD"

      if (createdAtDateString === todayDateString) {
        filteredData.push(item); // Add the item to filteredData if createdAt date matches today's date
      }
    });

    return filteredData;
  }

  Onsubmit() {
    // console.log(this.homeworkData.value)

    var date = this.homeworkData.value.selectedDate;
    var homeworkdesc = this.homeworkData.value.homework_desc;
    var sectionid = this.homeworkData.value.sectionlist;
    var subjectid = this.homeworkData.value.subjectslist;

    var filtered_section_list = [];
    for (var i = 0; i < this.homeworkData.value.sectionlist.length; i++) {
      var sec_obj = {
        id: this.homeworkData.value.sectionlist[i].id,
        section_name: this.homeworkData.value.sectionlist[i].section_name,
        updated: null,
      };
      filtered_section_list.push(sec_obj);
      // // console.log(filtered_section_list)
    }

    var subjectobject = {};
    // // console.log(this.subject_List)
    if (subjectid != "") {
      var selectedsubject = this.subject_List.filter(
        (e: { id: any }) => e.id == subjectid
      );
      subjectobject = {
        id: selectedsubject[0].id,
        subject_name: selectedsubject[0].subject_name,
      };
    }

    var obj = {
      report_date: date,
      year_info: { year_id: 21, year_name: "2023-2024" },
      faculty_info: {
        paycode: this.logininfo.paycode,
        designation: this.logininfo.designation,
        departmentname: this.logininfo.DepartmentName,
        employee_name: this.logininfo.empName,
        mobile_number: this.logininfo.mobileNo,
        campus_Id: this.logininfo.campusId,
      },
      campus_info: {
        campus_id: this.logininfo.campusId,
        campus_name: this.logininfo.campusName,
      },
      section_info: filtered_section_list,
      subject_info:
        this.selected_category[0].subjectdisplay == 1 ? subjectobject : {},
      homework_description: homeworkdesc,
      filetype:
        this.uploaded_info == null || this.uploaded_info == undefined
          ? null
          : this.uploaded_info.mimetype,
      filepath:
        this.uploaded_info == null || this.uploaded_info == undefined
          ? null
          : this.uploaded_info._id,
      filename:
        this.uploaded_info == null || this.uploaded_info == undefined
          ? null
          : this.uploaded_info.orginalName,
      category_info: this.homeworkData.value.category,
      notificationinfo: this.checked_notifications,
    };
    // // console.log(this.uploaded_info)
    // console.log(obj);

    if (confirm("Are You Sure Do You Want to Submit ?")) {
      this._homeworkService.home_work_create(obj).subscribe((data) => {
        // console.log(data);
        if (data.length > 0) {
          //  this.show_log_error = "Invalid Credentials";
          location.reload();
        } else {
          //  this.show_log_error = '';
        }
      });
    }
  }
}

function unique(sbjnm: any, arg1: string): any {
  const uniqueValues = [
    ...new Set(sbjnm.map((item: { [x: string]: any }) => item[arg1])),
  ];
  return uniqueValues;
}
