import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostjobService } from 'src/app/core/services/postjob.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { FormArray } from '@angular/forms';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

@Component({
  selector: 'app-postjob',
  templateUrl: './postjob.component.html',
  styleUrls: ['./postjob.component.css']
})
export class PostjobComponent implements OnInit {
  // jobList: any[] = [];
  job_description_form: FormGroup;
  job_eligibility_form: FormGroup;
  drive_details_form: FormGroup;
  currentStep: number = 0;
  public logininfo: any = [];
  selectedFile: File | any = null; // Store selected file
  isAgreed: boolean = false;
  instId: string | null = "";
  empName: string | null = "";
  paycode: string | null = "";
  yearName: string | null = "";
  imagefile: any;
  selectedFileName: any;
  campus_List: { name: string }[] = [];
  campuslist: any = [];
  department_List: { name: string }[] = [];
  deptartmentlist: any = [];
  loginyearinfo: any;
  // List of passout years for eligibility criteria
  passoutYear_List = [
    { year: '2025' }, { year: '2024' }, { year: '2023' }, { year: '2022' }, { year: '2021' }, { year: '2020' }, { year: '2019' }, { year: '2018' }, { year: '2017' }, { year: '2016' }
  ];


  constructor(
    private fb: FormBuilder,
    private _postjobService: PostjobService,
    private router: Router
  ) {

    // Job Description form initialization             
    this.job_description_form = this.fb.group({
      role: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z !@#$%^&*(),.\\-]*$')]],
      // package: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9.]*$')]],
      package: ['', [Validators.pattern('^[0-9.]*$')]],
      // bond: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9.]*$')]],
      service_agreement: ['', [Validators.pattern('^[0-9.]*$')]],
      joblocation: ['', [Validators.required, Validators.minLength(1), Validators.pattern('^[a-zA-Z, ]*$')]],
      jobdescription: ['', [Validators.required, Validators.minLength(100)]],
      company_name: ['', [Validators.required]],
      logo: [null, Validators.required],
      category: ['', Validators.required],
      website: ['', [Validators.required, Validators.pattern('^(http[s]?:\\/\\/){0,1}(www\\.){0,1}[a-zA-Z0-9\\.\\-]+\\.[a-zA-Z]{2,5}[\\.]{0,1}$')]],
      companyprofile: ['', [Validators.required, Validators.minLength(100)]],

    });

    // Job Eligibility form initialization
    this.job_eligibility_form = this.fb.group({
      departments: [[], Validators.required],
      campuses: [[], Validators.required],
      degree_cgpa: ['', [Validators.required, Validators.pattern('^[0-9.]*$'), Validators.min(1), Validators.max(10)]],
      tenth_cgpa: ['', [Validators.required, Validators.pattern('^[0-9.]*$'), Validators.min(1), Validators.max(100)]],
      inter_percentage: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1), Validators.max(100)]],
      max_backlogs_count: ['', [Validators.required]],
      passout_years: [[], Validators.required],
      job_eligibility_form_other_details: [''],
    });

    // Drive Details form initialization
    this.drive_details_form = this.fb.group({
      registration_link: ['', [Validators.required, Validators.pattern('^(https?:\\/\\/)?(www\\.)?[a-zA-Z0-9\\-]+(\\.[a-zA-Z]{2,})(:[0-9]{1,5})?(\\/.*)?$')]],
      // company_registration_link: [''],
      // college_registration_link: ['', Validators.required],
      registration_start_date: ['', Validators.required],
      registration_end_date: ['', Validators.required],
      mode_of_drive: ['', Validators.required],
      drive_location: ['', [Validators.required, Validators.pattern('^[a-zA-Z, ]*$')]],
      no_of_rounds: [0, [Validators.required, Validators.max(9)]],
      // no_of_rounds: ['', Validators.required],
      round_details: this.fb.array([]),
      // round_details: ['', Validators.required],
      selection_process: ['', [Validators.required, Validators.minLength(50)]],
      selection_criteria: ['', [Validators.required, Validators.minLength(50)]],
      drive_info: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      send_emails: [false],
      gender: [''],
      send_whatsapp_messages: [false],
      drive_details_form_other_details: ['']
    });
  }


  ngOnInit(): void {

    // Get logged-in user info from local storage
    this.logininfo = JSON.parse(localStorage.getItem("logindata") || '{}');
    this.instId = this.logininfo.instId || '';
    this.empName = this.logininfo.empName || '';
    this.paycode = this.logininfo.paycode || '';

    this.loginyearinfo = JSON.parse(localStorage.getItem("logindata_yr") || '{}');
    this.yearName = this.loginyearinfo[0]?.year_name || '';

    this.getcampuslist();
    this.getdepartmentlist();
  }

  List() {
    this.router.navigate(['/postjob_list']);
  }

  // Fetch list of campuses
  getcampuslist(): void {
    this._postjobService.Campuslist().subscribe(
      (response: any) => {
        this.campuslist = response;
        // console.log(this.campuslist)
        if (this.campuslist.length > 0) {
          this.campus_List = response.map((campus: any) => ({
            name: campus.campus_name
          }))
            .sort((a: any, b: any) => a.name.localeCompare(b.name));
        } else {
          console.warn('No campuses found or invalid response.');
        }
      },
      (error: any) => {
        console.error('Error fetching campus list:', error);
      }
    );
  }

  // Fetch list of departments
  getdepartmentlist(): void {
    this._postjobService.Departmentlist().subscribe(
      (response: any) => {
        this.deptartmentlist = response;
        // console.log(this.deptartmentlist)
        if (this.deptartmentlist.length > 0) {
          this.department_List = response.map((campus: any) => ({
            name: campus.course_main_name
          }))
            .sort((a: any, b: any) => a.name.localeCompare(b.name));
        } else {
          console.warn('No department found or invalid response.');
        }
      },
      (error: any) => {
        console.error('Error fetching department list:', error);
      }
    );
  }

  onDepartmentChange() {
    console.log('Selected Departments:', this.job_eligibility_form.value.departments);
  }

  onCampusChange() {
    console.log('Selected Campuses:', this.job_eligibility_form.value.campuses);
  }

  onPassoutYearChange() {
    console.log('Selected Passout Years:', this.job_eligibility_form.value.passout_years);
  }

  // Mark all controls in a form group or array as touched
  markFormGroupTouched(formGroup: FormGroup | FormArray) {
    if (!formGroup) {
      return;
    }

    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormControl) {
        control.markAsTouched();
        control.markAsDirty();
        control.updateValueAndValidity();

        if (control.value === null) {
          control.setValue(control.value);
        }
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Move to the next form step with validation
  nextStep() {
    const forms = [this.job_description_form, this.job_eligibility_form, this.drive_details_form];

    // Validate current form
    if (this.currentStep < forms.length) {
      this.markFormGroupTouched(forms[this.currentStep]);
      if (forms[this.currentStep].invalid) {
        return;
      }
    }

    // Move to next step
    this.currentStep++;

    // Force update of form values
    if (this.currentStep === 3) {
      this.job_description_form.updateValueAndValidity();
      this.job_eligibility_form.updateValueAndValidity();
      this.drive_details_form.updateValueAndValidity();
    }
  }

  // Helper function to populate the review step with data
  populateReviewStep() {
    this.job_description_form.patchValue(this.job_description_form.value);
    this.job_eligibility_form.patchValue(this.job_eligibility_form.value);
    this.drive_details_form.patchValue(this.drive_details_form.value);
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  // Triggered when a file is selected
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      console.log('image', this.selectedFile)
      this.uploadPhoto();
    }
  }

  // Upload logo image 
  uploadPhoto(): void {
    // console.log(this.selectedFile)
    const photofile = this.selectedFile;
    const filevault = "https://apis.aditya.ac.in/filevault/"
    const sptoken = '9cf742e6-4d25-4b73-acfe-648911a804e8';
    const uploadUrl = filevault + 'upload?api_key=' + sptoken;
    const photoUploadPath = '/analysis/placements';

    this._postjobService.uploadFileToUrl(photofile, uploadUrl, photoUploadPath).subscribe({
      next: async (response) => {
        console.log(response);
        var filekey = btoa(sptoken + response._id);
        response.fileurl = filevault + "download/" + response._id + "?key=" + filekey
        this.imagefile = response.fileurl;
        this.job_description_form.patchValue({ logo: this.imagefile });

        console.log(response)
        console.log(response.fileurl)
        console.log(this.imagefile)
        return response.fileurl
        // console.log(this.certificates_array)
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  // Get the FormArray for round details
  roundsArray: number[] = [];
  get roundDetailsArray(): FormArray {
    return this.drive_details_form.get('round_details') as FormArray;
  }

  // Handle changes in number of rounds
  onRoundsChange() {
    let numRounds = Number(this.drive_details_form.get('no_of_rounds')?.value) || 0;

    if (numRounds > 9) {
      numRounds = 9;
      this.drive_details_form.get('no_of_rounds')?.setValue(9);
    }

    this.roundsArray = Array.from({ length: numRounds }, (_, i) => i + 1);

    const roundDetailsArray = this.drive_details_form.get('round_details') as FormArray;

    while (roundDetailsArray.length > 0) {
      roundDetailsArray.removeAt(0);
    }

    for (let i = 0; i < numRounds; i++) {
      roundDetailsArray.push(this.fb.group(
        {
          id: i + 1,
          round: ['', Validators.required],
          label: `Round ${i + 1}`,
          status: "NA"
        }
      ));
    }

      roundDetailsArray.push(this.fb.group({
        id: numRounds + 1,  
        round: `Extra Round 1`,
        label: `Extra Round 1`,
        status: "NA"
      }));
      roundDetailsArray.push(this.fb.group({
        id: numRounds + 2,  
        round: `Extra Round 2`,
        label: `Extra Round 2`,
        status: "NA"
      }));
 


    this.drive_details_form.get('round_details')?.markAsTouched();
  }

  // Check if all forms are valid
  isFormValid(): boolean {
    return (
      this.job_description_form.valid &&
      this.job_eligibility_form.valid &&
      this.drive_details_form.valid
    );
  }

  // Submit the job post data
  submitForm(): void {
    if (!this.isFormValid()) {
      alert('Please fill in all required fields.');
      return;
    }

    // Confirmation Dialog
    const confirmation = confirm('Are you sure you want to submit this job posting?');
    if (!confirmation) {
      return;
    }

    const formData = new FormData();
    const jobDescriptionData = { ...this.job_description_form.value };

    formData.append('logo', this.imagefile);
    jobDescriptionData.logo = this.imagefile;

    formData.append('jobDescription', JSON.stringify(jobDescriptionData));
    formData.append('jobEligibility', JSON.stringify(this.job_eligibility_form.value));
    formData.append('driveDetails', JSON.stringify(this.drive_details_form.value));
    formData.append('empName', this.empName || '');
    formData.append('instId', this.instId || '');
    formData.append('paycode', this.paycode || '');

    const jobData = {
      jobName: this.drive_details_form.value.drive_info,
      jobType: this.drive_details_form.value.mode_of_drive,
      jobDescription: jobDescriptionData,
      jobEligibility: this.job_eligibility_form.value,
      driveDetails: this.drive_details_form.value,
      empinfo: {
        paycode: this.paycode,
        name: this.empName
      },
      academicYear: this.yearName,
      inst_id: this.instId
    };

    console.log("Final Job Data:", jobData);

    this._postjobService.JobPostsubmit(jobData).subscribe((data: any) => {
      if (data.status === true) {
        console.log("Response:", data);
        alert("Data Submitted Successfully");
        this.router.navigate(['/postjob_list'])
      } else {
        alert(data?.message || 'Error occurred');
      }
    },
      (error: any) => {
        console.error('Error fetching students list:', error);
        alert(error?.error?.message || 'Error occurred');
      });
  }

  // Show more/less toggles for long text fields
  showFullCompanyProfile = false;
  showFullJobDescription = false;
  showFullSelectionProcess = false;
  showFullSelectionCriteria = false;
  showFullDriveInfo = false;
  showFullOtherDetails = false

  toggleCompanyProfile() {
    this.showFullCompanyProfile = !this.showFullCompanyProfile;
  }

  toggleJobDescription() {
    this.showFullJobDescription = !this.showFullJobDescription;
  }

  toggleSelectionProcess() {
    this.showFullSelectionProcess = !this.showFullSelectionProcess;
  }

  toggleSelectionCriteria() {
    this.showFullSelectionCriteria = !this.showFullSelectionCriteria;
  }

  toggleDriveInfo() {
    this.showFullDriveInfo = !this.showFullDriveInfo;
  }
  toggleOtherDetails() {
    this.showFullOtherDetails = !this.showFullOtherDetails;
  }

  // Uncomment if PDF download is needed later
  // downloadPDF() {
  //   const element = document.getElementById('reviewSection');

  //   if (element) {
  //     html2canvas(element, {
  //       scale: 2,
  //       // useCORS: true
  //     }).then(canvas => {
  //       const pdf = new jsPDF('p', 'mm', 'a4');
  //       const imgData = canvas.toDataURL('image/png');

  //       // Add screenshot
  //       pdf.addImage(imgData, 'PNG', 10, 10, 190, (canvas.height * 190) / canvas.width);


  //         pdf.save('Job_Review.pdf');
  //     });
  //   }
  // }

}