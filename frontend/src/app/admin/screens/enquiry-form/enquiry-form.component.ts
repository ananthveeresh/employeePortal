import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as XLSX from 'xlsx';
import { EnquiryService } from 'src/app/core/services/enquiry.service';

@Component({
  selector: 'app-enquiry-form',
  templateUrl: './enquiry-form.component.html',
  styleUrls: ['./enquiry-form.component.css']
})
export class EnquiryFormComponent implements OnInit {
  logininfo: any = [];
  logininfo_yr: any = [];
  enquiries: any[] = [];
  showForm = 0;
  isEdit: boolean = false;
  selectedEnquiry: any = {
    gender: '',      // ✅ Set empty value
    instId: '',      // ✅ Set empty value
    course: [],      // ✅ Set empty value
    qualification: {},
    address: {},
    enq_category: '',
  };
  instituteinfo: any;
  inst_name: any=[];
  courseslist: any=[];
  excelData: any[] = []; // Holds the Excel data
  transformedData: any[] = [];
  filePath = 'assets/sampledata.xlsx'; // Example: stored in `assets/files/`
  isuploadexcel :boolean = false;
  stdaadhardata: string = "";

  constructor(private enquiryService: EnquiryService) {}

  ngOnInit(): void {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo);
    this.logininfo_yr = localStorage.getItem("logindata_yr");
    this.logininfo_yr = JSON.parse(this.logininfo_yr);
    this.enquiryService.instMaster().subscribe(data => {
      // console.log(data);
      this.instituteinfo = data;
      this.inst_name = this.instituteinfo.filter((item: any) => item.id == this.logininfo.instId)[0].short_code;
      // console.log(this.inst_name);
    });
    // console.log(this.logininfo.instId);
    this.enquiryService.courserbyInst(this.logininfo.instId).subscribe(data => {
      // console.log(data);
      this.courseslist = data;
    });
    this.loadEnquiries();
  }
  
  maskPhone(phone: string): string {
    return phone ? '**** **** ' + phone.slice(-4) : '';
  }

  togglePhone(enquiry: any) {
      enquiry.showPhone = !enquiry.showPhone;
  }


  loadEnquiries() {
    // console.log(this.logininfo.paycode);
    this.enquiries = [];
    this.enquiryService.getEnquiriesByUserId(this.logininfo.paycode).subscribe(data => {
      // console.log(data);
      this.enquiries = data;
    });
  }
  trackByFn(index: number, item: any): any {
    return item ? item.course_main_name : null;
  }
  

  onSubmit(form: NgForm) {
    // console.log(form.value, this.logininfo_yr);
    form.value.academic_year =this.logininfo_yr[0].year_name;
    form.value.campus =this.logininfo.campusName;
    form.value.campusId =this.logininfo.campusId;
    form.value.contactUs =this.logininfo.empName + " - " + this.logininfo.mobileNo;
    form.value.campusAddress =this.logininfo.campusAddress;
    form.value.inst_name =this.inst_name;
    form.value.user_id =this.logininfo.paycode;
    form.value.enq_type = "Online";
    form.value.qualification = this.selectedEnquiry.qualification;
    // console.log(form.value);
    // console.log("Selected Courses before submit:", this.selectedEnquiry.course);
    if (this.isEdit) {
      this.enquiryService.updateEnquiry(this.selectedEnquiry.enquiry_id, form.value).subscribe(() => {
        alert('Enquiry Updated Successfully');
        this.showForm = 0;
        this.loadEnquiries();
      });
    } else {
      this.enquiryService.createEnquiry(form.value).subscribe((data) => {
        // console.log(data)
        alert('Enquiry Submitted Successfully');
        form.reset();
        this.showForm = 0;
        this.loadEnquiries();
      });
    }
  }

  editEnquiry(enquiry: any) {
    this.selectedEnquiry = JSON.parse(JSON.stringify(enquiry)); // Clone object to avoid direct reference
    if (!this.selectedEnquiry.qualification) {
      this.selectedEnquiry.qualification = { class: '', school: '', year: '', place_of_study: '', marks:'' };
    }

    // Convert single string course into an array
    if (typeof this.selectedEnquiry.course === 'string') {
      this.selectedEnquiry.course = [this.selectedEnquiry.course]; // ✅ Convert single string to array
    }
     // ✅ Ensure address is defined
    if (!this.selectedEnquiry.address) {
        this.selectedEnquiry.address = { street: '', city: '', state: '', zip: '' };
    }
    // Convert course list to match `bindValue`
    if (this.selectedEnquiry.course && this.selectedEnquiry.course.length > 0) {
        this.selectedEnquiry.course = this.selectedEnquiry.course.map((c: any) => 
            typeof c === 'object' ? c.course_main_name : c
        );
    }
    this.showForm = 1;
    this.isEdit = true;
  }

  findAadharNo() {
    var keyval = this.selectedEnquiry.aadhar_no; 
    console.log(keyval);
    if(keyval.length == 12) {
      this.enquiryService.findAadharNo(keyval).subscribe(data => {
        console.log(data);
        if(data.length > 0) {
          this.stdaadhardata = "Aadhar Number Already Exist";
        } else { 
          this.stdaadhardata = "";
        }
      });
    }
  }

  addQualification() {
    this.selectedEnquiry.qualifications.push({
      class: '',
      school: '',
      year: '',
      place_of_study: '',
      medium: '',
      marks: ''
    });
    // console.log(this.selectedEnquiry.qualifications);
  }

  removeQualification(index: number) {
    this.selectedEnquiry.qualifications.splice(index, 1);
  }

   // Handle file selection and parse Excel
   onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Read the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Transform first row into keys and create an array of objects
        this.excelData = this.convertToObjects(rawData);
        // console.log('Parsed Data:', this.excelData);
        this.isuploadexcel = true;
      } catch (error) {
        console.error('Error processing Excel file:', error);
      }
    };

    reader.onerror = (error) => console.error('File reading error:', error);
  }

  // Convert first row to keys and map values
  convertToObjects(data: any[]): any[] {
    if (!data.length) return [];
    const keys = data[0]; // First row as keys
    return data.slice(1).map(row =>
      Object.fromEntries(keys.map((key:any, index:any) => [key, row[index]]))
    );
  }

  uploadData() {
      console.log('Uploading data:', this.excelData);
       this.transformedData = this.excelData.map(student => ({
        student_name: student.student_name,
        father_name: student.father_name,
        gender: student.gender,
        course: student.course,
        phone_no: student.phone_no,
        email: student.email,
        aadhar_no: Number(student.aadhar_no),  // Convert aadhar_no to Number
        address: {
          street: student.street,
          city: student.city,
          state: student.state,
          zip: student.zip
        },
        qualifications: [
          {
            class: student.prev_class,
            school: student.prev_college,
            year: student.year_of_passed,
            place_of_study: student.place_of_study,
            medium: student.Medium,
            marks: student.marks
          }
        ],
        academic_year: this.logininfo_yr[0].year_name,
        campus: this.logininfo.campusName,
        inst_name: this.inst_name,
        user_id: this.logininfo.paycode,
        enq_type: "Offline"
      }));
      this.enquiryService.uploadEnquiries(this.transformedData).subscribe(() => {
        alert('Enquiries Uploaded Successfully');
        this.showForm = 0;
        this.loadEnquiries();
      });
  }
  
  downloadExcel() {
    const link = document.createElement('a');
    link.href = this.filePath;
    link.setAttribute('download', 'StudentData.xlsx'); // Set filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  searchText: string = '';
  searchEnquiries() {
    // console.log(this.searchText.length);
    if(this.searchText.length > 3) {
      this.enquiryService.getEnquiriesBySearch(this.searchText).subscribe(data => {
        this.enquiries = data;
      });
    }
  }
}
