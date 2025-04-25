import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as XLSX from 'xlsx';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EnquiryService } from 'src/app/core/services/enquiry.service';
import { TextCapitalizePipe } from 'src/app/core/services/text-capitalize.pipe';

@Component({
  selector: 'app-enquiry-form-entry',
  templateUrl: './enquiry-form-entry.component.html',
  styleUrls: ['./enquiry-form-entry.component.css']
})
export class EnquiryFormEntryComponent implements OnInit {
  logininfo: any = [];
  logininfo_yr: any = [];
  enquiries: any[] = [];
  showForm = 0;
  isEdit: boolean = false;
  instituteinfo: any;
  inst_name: any=[];
  courseslist: any=[];
  searchText : string = '';
  selectedEnquiry: any = {
    selectedCourses: [],
    student_name: '',
    aadhar_no: '',
    phone_no: '',
    gender: '',
    father_name: '',
    father_occupation: '',
    showEducationDetails: false, // Initialize the boolean property
    showAddressDetails: false, // Initialize the boolean property
    qualification: {
      class: '',
      school: '',
      year: '',
      place_of_study: '',
      marks: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    enq_category: '',
    caste : ''
  };
  editedEnquiry: any = {
    gender: '',      // ✅ Set empty value
    instId: '',      // ✅ Set empty value
    course: [],      // ✅ Set empty value
    qualification: {},
    address: {},
    enq_category: '',
  };
  filteredCourses: any[] = [];
  studentresult: any = [];
  enq_category_list: any = [
    { id: 1, name: 'Circle' },
    { id: 2, name: 'Blood Relation' },
    { id: 3, name: 'College Data' },
    { id: 4, name: 'Alumni' },
    { id: 5, name: 'Current Student' },
    { id: 6, name: 'Other' }
  ]
  nodatainsrh = 0;
  activeEnquiryId: string | null = null;
  enqsummary: { enq_status: string; noof_students: any; }[];
  totalenquiries: any;
  courseSelectionError: boolean = false;
  selectedCategory: string = '';
  session_user_id: any;
  session_campus: any;
  session_academic_year: any;
  nonabove : boolean = false;

  constructor(private enquiryService: EnquiryService) {}
  ngOnInit(): void {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo);
    this.logininfo_yr = localStorage.getItem("logindata_yr");
    this.logininfo_yr = JSON.parse(this.logininfo_yr);
    this.session_user_id = this.logininfo.paycode
    this.session_campus = this.logininfo.campusName
    this.session_academic_year = this.logininfo_yr[0].year_name
    this.enquiryService.instMaster().subscribe(data => {
      // console.log(data);
      this.instituteinfo = data;
      this.inst_name = this.instituteinfo.filter((item: any) => item.id == this.logininfo.instId)[0].short_code;
      // console.log(this.inst_name);
    });
    // console.log(this.logininfo.instId);
    this.enquiryService.courserbyInst(this.logininfo.instId).subscribe(data => {
      // console.log(data);
      this.courseslist = data.filter((cr: any) => cr.admcourse == 1);
      this.filteredCourses = data.filter((cr: any) => cr.admcourse == 1); // Initially show all courses
    });
    this.loadEnquiries();
    // console.log(new TextCapitalizePipe().transform("KOYYA V V RAVI KUMAR"));
  }
  loadEnquiries() {
    // console.log(this.session_user_id);
    this.enquiries = [];
    this.enquiryService.getEnquiriesByUserId(this.session_user_id).subscribe(data => {
      // console.log(data);
      this.enquiries = data;
      this.totalenquiries = data;
    });
    this.enquiryService.getSummarybyUserId(this.session_academic_year, this.session_user_id).subscribe(data => {
      // console.log(data);
      this.enqsummary = data;
    });
  }

  bulkdataurl(){
    var user_id = this.session_user_id
    var campus = this.session_campus
    window.open("https://analysis.aditya.ac.in/staff/leads/index.html?branch="+campus+"&code="+user_id, "_blank");
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      "New": "bi bi-plus-circle text-primary",
      "Interested": "bi bi-eye text-info",
      "Joined": "bi bi-check-circle text-success",
      "Not Interested": "bi bi-x-circle text-danger",
      // "Follow-up": "bi bi-telephone text-warning",
      "Total": "bx bx-list-ol text-secondary"
    };
    
    return iconMap[status] || "bi bi-question-circle text-muted"; // Default icon
  }

  getStatusSummary(status: string): string {
    const iconMap: { [key: string]: string } = {
      "New": "text-warning",
      "Interested": "text-primary",
      "Joined": "text-success",
      "Not Interested": "text-danger",
      // "Follow-up": "bi bi-telephone text-warning",
      "Total": "text-secondary"
    };
    
    return iconMap[status] || "bi bi-question-circle text-muted"; // Default icon
  }

  editStatus(enquiry: any) {
    // Show the select dropdown
    enquiry.isEditing = true;
  }
  
  updateStatus(enquiry: any) {
    // Hide the select dropdown after selection
    enquiry.isEditing = false;
    
    // Call an API or perform an action if needed
    // console.log("Updated Status:", enquiry.enq_status);
    this.enquiryService.updateEnquiry(enquiry.enquiry_id, enquiry).subscribe(() => {
      // alert('Enquiry Updated Successfully');
      this.showForm = 0;
      this.loadEnquiries();
    });
  }

  filterEnquiriesbyStatus(enq_status:string, nofostds:Number) {
    this.selectedCategory = enq_status;
   
    let stdobj: any = {
      userid :this.session_user_id,
      acdYear :this.session_academic_year,
      limit : nofostds
    }
    // Only add `enqstatus` if it is NOT "total"
    if (enq_status !== "Total") {
      stdobj.enqstatus = enq_status;
    }
    // console.log(stdobj)
    this.enquiryService.filterEnquiries(stdobj).subscribe((data) => {
      this.enquiries = data
    });

  }


  editEnquiry(enquiry: any) {
    this.editedEnquiry = JSON.parse(JSON.stringify(enquiry)); // Clone object to avoid direct reference
    if (!this.editedEnquiry.qualification) {
      this.editedEnquiry.qualification = { class: '', school: '', year: '', place_of_study: '', marks:'' };
    }

    // Convert single string course into an array
    if (typeof this.editedEnquiry.course === 'string') {
      this.editedEnquiry.course = [this.editedEnquiry.course]; // ✅ Convert single string to array
    }
     // ✅ Ensure address is defined
    if (!this.editedEnquiry.address) {
        this.editedEnquiry.address = { street: '', city: '', state: '', zip: '' };
    }
    // Convert course list to match `bindValue`
    if (this.editedEnquiry.course && this.editedEnquiry.course.length > 0) {
        this.editedEnquiry.course = this.editedEnquiry.course.map((c: any) => 
            typeof c === 'object' ? c.course_main_name : c
        );
    }
    this.showForm = 1;
    this.isEdit = true;
  }

  searchEnquiries() {
    // console.log(this.searchText.length);
    if (!this.searchText || this.searchText.trim().length === 0) {
      // Reset enquiries when search is cleared
      this.loadEnquiries();
      return;
    }
    let stdobj = {
      user_id :this.session_user_id,
      campus :this.session_campus,
      academic_year :this.session_academic_year,
      keyword: this.searchText
    }
    if(this.searchText.length > 3) {
      this.enquiryService.getEnquiriesBySearch(stdobj).subscribe(data => {
        if(data.length>0){
          this.enquiries = data;
        } else {
          this.nodatainsrh = 1
        }
        
      });
    }
  }

  validateCourses() {
    if (!this.filteredCourses.some(course => course.selected)) {
        this.courseSelectionError = true;
        return;
    }
    this.courseSelectionError = false;
    this.showForm = 3;
    this.updateSelectedCourses();
  }

  // Called when checkbox state changes
  updateCourseSelection() {
    this.courseSelectionError = !this.courseslist.filter((course: any) => course.selected);
  }

  updateSelectedCourses(): void {
    var filtercourses = this.courseslist.filter((course: { selected?: boolean }) => course.selected);
    this.selectedEnquiry.course = filtercourses.map((course: any) => course.course_main_name);
  }

  filterCourses(): void {
    this.filteredCourses = this.courseslist.filter((cr:any) =>
      cr.course_main_name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  findStudent(): void {
    if(!this.nonabove){
      var stdobj = {
        campus :this.session_campus,
        academic_year :this.session_academic_year,
        student_name: this.selectedEnquiry.student_name,
        aadhar_no: this.selectedEnquiry.aadhar_no,
        phone_no: this.selectedEnquiry.phone_no,
      };
      this.enquiryService.verifyStudent(stdobj).subscribe(data => {
        // console.log(data);
        if(data.length > 0){
          this.studentresult = data; 
          this.showForm = 4;
        } else {
          this.showForm = 5;
        }
      });
    } else {
      this.showForm = 5;
    }
    
  }

  submitForm(): void {
    this.selectedEnquiry.academic_year = this.session_academic_year;
    this.selectedEnquiry.campus = this.session_campus;
    this.selectedEnquiry.campusId = this.logininfo.campusId;
    this.selectedEnquiry.contactUs = `${this.logininfo.empName} - ${this.logininfo.mobileNo}`;
    this.selectedEnquiry.user_info = {
      user_name: this.logininfo.empName,
      user_mobile: this.logininfo.mobileNo
    };
    this.selectedEnquiry.campusAddress = this.logininfo.campusAddress;
    this.selectedEnquiry.inst_name = this.inst_name;
    this.selectedEnquiry.user_id = this.session_user_id;
    this.selectedEnquiry.qualification = this.selectedEnquiry.qualification;
  
    // console.log('Form Data:', this.selectedEnquiry);
  
    this.enquiryService.createEnquiry(this.selectedEnquiry).subscribe({
      next: (data) => {
        alert('Enquiry Submitted Successfully');
        this.showForm = 0;
        this.loadEnquiries();
      },
      error: (err) => {
        // console.error('Error:', err);
        console.log(err)
        let errorMessage = err.error.message;
        alert(errorMessage);
        this.showForm = 0;
        this.loadEnquiries();
      }
    });
  }
  

  updateEnquiry() {
    // console.log(this.editedEnquiry);
    // console.log("Selected Courses before submit:", this.selectedEnquiry.course);
    this.enquiryService.updateEnquiry(this.editedEnquiry.enquiry_id, this.editedEnquiry).subscribe(() => {
      alert('Enquiry Updated Successfully');
      this.showForm = 0;
      this.loadEnquiries();
    });
    
  }

  toggleCollapse(enquiryId: string) {
    this.activeEnquiryId = this.activeEnquiryId === enquiryId ? null : enquiryId;
  }

  deleteStd(stdid:any, stdstatus:String){
    if(stdstatus!="Joined"){
      if (confirm("Are you sure you want to delete student enquiry.")) {
        this.enquiryService.deleteStudent(stdid).subscribe(() => {
          alert('Enquiry Deleted Successfully');
          this.showForm = 0;
          this.loadEnquiries();
        });
      }
    } else {
      alert("You Con't delete joined student");
    }
    
  }
}
