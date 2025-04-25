import { Component } from "@angular/core";
import { DashboardService } from "src/app/core/services/dashboard.service";
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from "@angular/platform-browser";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  providers: [DatePipe],
})
export class DashboardComponent {
  title = "empdesign";
  employees: any = [];
  logininfo: any = [];
  imageData: any;
  selectedfiletype: any;
  working: any;
  Absent: any;
  Lates: any;
  balance_Cls: any;
  Today: any;
  currentDate: any;
  today_Data: any;
  monthyear: any;
  yrMaster_academicyr: any;
  emp_inst_Name: any;

  constructor(
    private _dashoardService: DashboardService,
    private sanitizer: DomSanitizer,
    private _http: HttpClient,
    public datepipe: DatePipe
  ) { }
  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {
    this.logininfo = localStorage.getItem("logindata");
    this.logininfo = JSON.parse(this.logininfo);
    // console.log(this.logininfo);
    // this.employees = this.logininfo
    // console.log(this.employees)

    this.get_image(this.logininfo);

    this._dashoardService
      .inst_details(this.logininfo.instId)
      .subscribe((data: any) => {
        // console.log(data[0])
        this.emp_inst_Name = data[0].institute_name;
      });

    this._dashoardService
      .get_emp_details(this.logininfo.paycode)
      .subscribe((data: any) => {
        // console.log(data[0])
        this.employees = data;
        // console.log(this.employees);
      });
    this._dashoardService
      .working(this.logininfo.paycode)
      .subscribe((data: any) => {
        // console.log(data)
        if(data.data.monthlysummary.length > 0){
          var curDate = data.data.monthlysummary[0].monthYear;
          this.monthyear = convertDateFormat(curDate);
          this.working = data.data.monthlysummary[0].NoRec;
          //  // console.log(this.working)
          this.Absent = data.data.monthlysummary[0].Absent;
          // // console.log(this.Absent)
          this.Lates = data.data.monthlysummary[0].LateBy;
        } else {
          this.working = 0;
          this.Absent = 0;
          this.Lates = 0;
        }
        if(data.data.paidleaves.length > 0){ 
          this.balance_Cls = data.data.paidleaves[0].totalcl - data.data.paidleaves[0].usedCL;
        } else {
          this.balance_Cls = 0;
        }

        if (data.data.dayreport.length == 0) {
          this.today_Data = "A";
        } else {
          this.today_Data = data.data.dayreport[0].DetailedStatusCode;
        }
        // // console.log(this.Lates)
      });
  }

  get_image(file_data: any) {
    // // console.log(file_data)
    const token = "9cf742e6-4d25-4b73-acfe-648911a804e8";
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);


    const url =
      "https://apis.aditya.ac.in/filevault/download/" + file_data.photoId;

    this._http.get(url, { headers, responseType: "blob" }).subscribe(
      (data: Blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageData = reader.result as string;
          if (this.selectedfiletype == "pdf") {
            this.imageData = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.imageData
            );
          } else {
            this.imageData = this.imageData;
          }
          // // console.log(this.imageData);
        };
        reader.readAsDataURL(data);
      },
      (error: HttpErrorResponse) => {
        console.error("Error downloading image:", error);
      }
    );
  }
}

function convertDateFormat(dateStr: any) {
  const [month, year] = dateStr.split("-");

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${monthNames[parseInt(month) - 1]}-${year}`;
}
