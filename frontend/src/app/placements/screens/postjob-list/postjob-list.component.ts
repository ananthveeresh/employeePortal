import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostjobService } from 'src/app/core/services/postjob.service';
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-postjob-list',
  templateUrl: './postjob-list.component.html',
  styleUrls: ['./postjob-list.component.css']
})
export class PostjobListComponent implements OnInit {
  job_Post_List: any[] = [];
  selectedJobData: any;
  showJobDetails: boolean = false;
  filteredJobs: any[] = [];
  activeTab: string = 'live'; // Default tab
  searchText: string = '';
  eligible_students: any[] = [];
  activeTabIndex: number = 0; // 0 for Drive details, 1 for Eligible Students, 2 for Selected Students
  totalStaticTabs: number = 4;
  studentsList: any;
  isFileSelected: boolean;
  fileName: any;
  uploaded_Excel_data: any;
  enableUploadButton: boolean = false;
  updateByRoundid: any;
  eligle_students_by_rounds: any[] = [];
  eligle_students_selected: any[] = [];
  students_attendance: any[] = [];
  delete_students_attendance: any[] = [];
  delete_selected_students: any[] = [];
  delete_rounds: any[] = [];
  driveSummaryData: any;
  isAgreed: boolean = false;
  attendanceFile: File | null = null;
  roundFiles: { [key: string]: File | null } = {};
  selectedFiles: File | null = null;
  attendanceFileName: string = '';
  roundFileNames: { [key: string]: string } = {};
  selectedFileName: string = '';
  totalStudents: number = 0; // Variable to store the total count of students
  interestedStudents: number = 0; // Variable to store the total count of students
  attendenceTotalStudents: number = 0; // Variable to store the total count of students
  attendenceSelectedStudents: number = 0; // Variable to store the total count of students
  SelectedTotalStudents: number = 0; // Variable to store the total count of students
  SelectedStudentsCount: number = 0; // Variable to store the total count of students
  RoundTotalStudents: number = 0; // Variable to store the total count of students
  RoundStudentsCount: number = 0; // Variable to store the total count of students

  constructor(private _postjobService: PostjobService, private router: Router, private location: Location) { }

  // ngOnInit(): void {
  //   this._postjobService.JobPostList().subscribe(data => {
  //     console.log('job_Post_List', data);

  //     const today = new Date().setHours(0, 0, 0, 0);

  //     // Mark jobs in progress based on registration end date and sort them
  //     this.job_Post_List = data.map((job: any) => ({
  //       ...job,
  //       isLive: new Date(job?.driveDetails?.registration_end_date || 0).getTime() >= today
  //     })).sort((a: any, b: any) =>
  //       new Date(b?.driveDetails?.registration_end_date || 0).getTime() -
  //       new Date(a?.driveDetails?.registration_end_date || 0).getTime()
  //     );

  //     this.filterJobs(); // Apply initial filter
  //   });

  // }

  getActiveTabName(): string {
    if (this.activeTabIndex === 0) return 'Drive Details';
    if (this.activeTabIndex === 1) return 'Eligible Students';
    if (this.activeTabIndex === 2) return 'Attendance';
    if (this.activeTabIndex === 3) return 'Selected Students';
    if (this.activeTabIndex >= 4 && this.activeTabIndex < this.totalStaticTabs + this.selectedJobData.driveDetails?.round_details?.length) {
      return this.selectedJobData.driveDetails.round_details[this.activeTabIndex - this.totalStaticTabs]?.round;
    }
    return 'Select Tab';
  }

  ngOnInit(): void {
    this._postjobService.JobPostList().subscribe(data => {
      console.log('job_Post_List', data);

      this.job_Post_List = data.map((job: any) => ({
        ...job,
        isLive: job.driveStatus === "Completed"
      }))

      this.filterJobs(); // Apply initial filter
    });

  }

  // Filter jobs based on active tab and search input
  filterJobs(event?: any) {
    this.searchText = event?.target.value.toLowerCase() || '';

    this.filteredJobs = this.job_Post_List.filter(job =>
      (this.activeTab === 'live' ? !job.isLive : job.isLive) &&
      (!this.searchText ||
        job.jobDescription?.role?.toLowerCase().includes(this.searchText) ||
        job.jobDescription?.company_name?.toLowerCase().includes(this.searchText))
    );
    console.log("Filtered Jobs", this.filteredJobs);
  }


  // Switch between tabs
  switchTab(tabIndex: number, roundid: number): void {
    this.activeTabIndex = tabIndex;
    if (tabIndex === 0) {
      this.getDriveStatus(this.selectedJobData.jobName, this.selectedJobData.academicYear);
    } else if (tabIndex === 1) {
      this.eligiblestudentssubmit(this.selectedJobData.jobName, this.selectedJobData.academicYear);
    }  else if (tabIndex === 2) {
      this.getAttendancestatus();
    } else if (tabIndex >= this.totalStaticTabs) {
      this.updateByRoundid = roundid
      this.getstdsbydriveandstatus();
    } else if (tabIndex === 3) {
      this.getsselectedstatus();
    }
  }

  // Fetch job details by ID and set view tab
  fetchJobDetails(jobId: string, tabIndex: number = 0, roundid: number): void {
    this.eligible_students = [];
    this.eligle_students_by_rounds = [];
    this.eligle_students_selected = [];
    this.students_attendance = [];
    console.log(jobId, tabIndex, roundid)
    this._postjobService.JobPostListById(jobId).subscribe(
      (data: any) => {
        console.log(data)
        this.selectedJobData = data[0];
        // console.log(this.selectedJobData)
        this.showJobDetails = true;
        this.activeTabIndex = tabIndex; // Set the active tab index
        console.log(this.activeTabIndex)
        if (tabIndex === 0) {
          this.getDriveStatus(this.selectedJobData.jobName, this.selectedJobData.academicYear);
        } else if (tabIndex === 1) {
          this.eligiblestudentssubmit(this.selectedJobData.jobName, this.selectedJobData.academicYear);
        } else if (tabIndex === 2) {
          this.getAttendancestatus();
        } else if (tabIndex >= this.totalStaticTabs) {
          this.updateByRoundid = roundid;
          this.getstdsbydriveandstatus();
        } else if (tabIndex === 3) {
          this.getsselectedstatus();
        }
      },
      (error) => {
        console.error('Error fetching job details:', error);
      }
    );
  }

  // Fetch eligible students based on driveName & academicYear
  eligiblestudentssubmit(jobName: any, academicYear: any): void {

    const jobData = {
      "driveName": jobName,
      "academicYear": academicYear
    }

    console.log('Sending jobData:', jobData);

    this._postjobService.JobPosteligiblestudents(jobData).subscribe(
      (data: any) => {
        if (data.status) {
          this.eligible_students = data.data.sort((a: any, b: any) =>
            (a.campusName?.toLowerCase() || '').localeCompare(b.campusName?.toLowerCase() || '')
          );
          console.log('Eligible Students:', this.eligible_students);

          this.totalStudents = this.eligible_students.reduce(
            (acc: number, campus: any) => acc + campus.count,
            0
          );
          this.interestedStudents = this.eligible_students.reduce(
            (acc: number, campus: any) => acc + campus.interestedCount,
            0
          );
          console.log('Total Students:', this.totalStudents);

        } else {
          this.eligible_students = [];
          console.error('Unexpected response format:', data);
          alert(data.message || 'no students found.');
        }
      },
      (error: any) => {
        console.error('Error fetching students list:', error);
        this.eligible_students = [];
        if (this.activeTabIndex === 1) {
          alert(error?.statusText || 'Error occurred while fetching eligible students.');
        }

      }
    );
  }

  getDriveStatus(jobName: string, academicYear: string) {
    const obj = {
      driveName: jobName,
      academicYear: academicYear
    };
  
    this._postjobService.jobdrivestatus(obj).subscribe((res: any) => {
      if (res.status) {
        this.driveSummaryData = res.result[0]; 
        console.log('Drive Summary:', this.driveSummaryData);
      } else {
        this.driveSummaryData = null;
      }
    });
  }
  

  // Convert eligible students list to Excel and trigger download
  downloadEligibleStudentsExcel(students: any): void {
    console.log('Full response:', students);

    if (students.length === 0) {
      console.warn('Empty students array found');
      return;
    }

    const formattedData = students.map((student: any) => ({
      "SUC": student.sucode || '',
      "Student Name": student.studentName || '',
      "Roll No": student.rollNo || '',
      "Gender": student.gender || '',
      "Father Name": student.fathername || '',
      "Mother Name": student.mothername || '',
      "Address": student.studentaddress || '',
      "City": student.city || '',
      "State": student.state || '',
      "Pincode": student.pincode || '',
      "Email": student.studentEmail || '',
      "Mobile Number": student.mobileNumber || '',
      "WhatsApp Number": student.whatsappNumber || '',
      "Course Name": student.courseName || '',
      "Campus Name": student.campusName || '',
      "Section Name": student.sectionName || '',
      "SSC Year of Passing": student.sscyearofpass || '',
      "SSC GPA": student.sscgpa || '',
      "Intermediate Year of Passing": student.interyearofpass || '',
      "Intermediate Percentage": student.interpercentage || '',
      "Degree University": student.degreeuniversity || '',
      "Degree Average CGPA": student.degreeavgcgpa || '',
      "Degree Backlogs": student.degreebacklogs || '',
      "Degree Year of Passing": student.degreeyearofpass || '',
      "Attendance": student.attendance || '',
      "Drive Name": student.driveName || '',
      "Mode of Drive": student.modeofDrive || '',
      "Drive Status": student.driveStatus || '',
      "Final Selection": student.finalSelection || '',
      ...student.roundDetails?.reduce((acc: any, round: any, index: number) => {
        acc[`Round ${index + 1} (${round.round})`] = round.status;
        return acc;
      }, {})
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Eligible Students': worksheet },
      SheetNames: ['Eligible Students']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, 'Eligible_Students_List.xlsx');
  }



  onAttendanceFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.attendanceFile = file;
      this.attendanceFileName = file.name;
      this.readExcelFile(file, 'attendance');
    }
  }

  onRoundFileSelected(event: any, roundId: string) {
    const file = event.target.files[0];
    if (file) {
      this.roundFiles[roundId] = file;
      this.roundFileNames[roundId] = file.name;
      this.readExcelFile(file, 'round');
    }
  }

  onSelectedFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles = file;
      this.selectedFileName = file.name;
      this.readExcelFile(file, 'selected');
    }
  }

  private readExcelFile(file: File, type: string) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const newData = XLSX.utils.sheet_to_json(sheet);

      if (type === 'attendance') {
        this.uploaded_Excel_data = newData;
      } else if (type === 'round') {
        this.uploaded_Excel_data = newData;
      } else if (type === 'selected') {
        this.uploaded_Excel_data = newData;
      }

      console.log('Uploaded Excel Data:', this.uploaded_Excel_data);
      this.enableUploadButton = true;
    };
    reader.readAsArrayBuffer(file);
  }

  excelupload(rounds: any) {
    this.updateByRoundid = rounds?.id;
    const obj = {
      "drivename": this.selectedJobData.jobName,
      "academicYear": this.selectedJobData.academicYear,
      "studentInfo": this.uploaded_Excel_data,
      "roundid": this.updateByRoundid,
      "roundStatus": "Selected"
    }
    console.log('data', obj)
    this._postjobService.jobPostupdateRounds(obj).subscribe((response: any) => {
      console.log('Update Students:', response);
      alert(`Updated ${rounds.round} round`);

      this.uploaded_Excel_data = [];
      this.isFileSelected = false;
      this.enableUploadButton = false;
      this.fileName = '';
      this.getstdsbydriveandstatus();
    })
  }

  downloadSelectedStudentsExcel(students: any): void {
    console.log('Full response:', students);

    if (students.length === 0) {
      console.warn('Empty students array found');
      return;
    }

    const formattedData = students.map((student: any) => ({
      "SUC": student.sucode || '',
      "Student Name": student.studentName || '',
      "Roll No": student.rollNo || '',
      "Gender": student.gender || '',
      "Email": student.studentEmail || '',
      "Mobile Number": student.mobileNumber || '',
      "WhatsApp Number": student.whatsappNumber || '',
      "Course Name": student.courseName || '',
      "Campus Name": student.campusName || '',
      "Section Name": student.sectionName || '',
      "Attendance": student.attendance || '',
      "Drive Name": student.driveName || '',
      "Mode of Drive": student.modeofDrive || '',
      "Drive Status": student.driveStatus || '',
      "Final Selection": student.finalSelection || '',
      ...student.roundDetails?.reduce((acc: any, round: any, index: number) => {
        acc[`Round ${index + 1} (${round.round})`] = round.status;
        return acc;
      }, {})
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Students': worksheet },
      SheetNames: ['Students']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, 'Students_List.xlsx');
  }

  getstdsbydriveandstatus() {
    console.log('Calling getstdsbydriveandstatus()');

    const obj = {
      "driveName": this.selectedJobData.jobName,
      "academicYear": this.selectedJobData.academicYear,
      "roundId": this.updateByRoundid,
      "roundStatus": "Selected"
    }
    console.log(obj)
    this._postjobService.jobPoststdsbydriveandstatus(obj).subscribe((data: any) => {
      if (data.status) {
        this.eligle_students_by_rounds = data.result.sort((a: any, b: any) =>
          (a.campusName?.toLowerCase() || '').localeCompare(b.campusName?.toLowerCase() || '')
        );
        this.delete_rounds = data.result.flatMap((entry: any) => entry.students || [])
        console.log('Eligible Students:', this.eligle_students_by_rounds);

        this.RoundTotalStudents = this.eligle_students_by_rounds.reduce(
          (acc: number, campus: any) => acc + campus.totalStudents,
          0
        );
        this.RoundStudentsCount = this.eligle_students_by_rounds.reduce(
          (acc: number, campus: any) => acc + campus.count,
          0
        );

      } else {
        this.eligle_students_by_rounds = [];
        console.error('Unexpected response format:', data);
        // alert(data.message || 'no students found.');
      }
    },
      (error: any) => {
        console.error('Error fetching students list:', error);
        this.eligle_students_by_rounds = [];
        if (this.activeTabIndex >= this.totalStaticTabs) {
          // alert(error?.statusText || 'Error occurred while fetching eligible students.');
        }

      })
  }
  // deleteround(rounds: any) {
  //   this.updateByRoundid = rounds?.id;

  //   if (!this.delete_rounds?.length) {
  //     alert('No students to update attendance.');
  //     return;
  //   }

  //   const sucodeArray = this.delete_rounds
  //     .filter(student => student?.sucode)
  //     .map(student => ({ suc: student.sucode }));

  //   if (!sucodeArray.length) {
  //     alert('No valid student codes found.');
  //     return;
  //   }

  //   const obj = {
  //     "drivename": this.selectedJobData.jobName,
  //     "academicYear": this.selectedJobData.academicYear,
  //     "studentInfo": sucodeArray,
  //     "roundid": this.updateByRoundid,
  //     "roundStatus": "NA"
  //   }
  //   console.log('data', obj)
  //   // return;
  //   this._postjobService.jobPostupdateRounds(obj).subscribe(
  //     (response: any) => {
  //       console.log('API Response:', response);
  //       this.getstdsbydriveandstatus();
  //       alert('Status updated');
  //     },

  //   );

  // }

  deleteround(rounds: any, campusName: string) {
    this.updateByRoundid = rounds?.id;
  
    // Filter students by campusName
    const studentsToDelete = this.delete_rounds?.filter(
      student => student?.sucode && student?.campusName === campusName
    );
  
    if (!studentsToDelete?.length) {
      alert(`No students found for campus: ${campusName}`);
      return;
    }
  
    const sucodeArray = studentsToDelete.map(student => ({ suc: student.sucode }));
  
    const obj = {
      drivename: this.selectedJobData.jobName,
      academicYear: this.selectedJobData.academicYear,
      studentInfo: sucodeArray,
      roundid: this.updateByRoundid,
      roundStatus: "NA"
    };
  
    console.log('Deleting students for campus:', campusName, obj);
  
    this._postjobService.jobPostupdateRounds(obj).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        alert(`Status updated for ${campusName}`);
        this.getstdsbydriveandstatus(); // refresh data
      },
      error => {
        console.error('Error while deleting students:', error);
        alert('Failed to update status.');
      }
    );
  }
  


  excelselectedupload() {
    const obj = {
      "drivename": this.selectedJobData.jobName,
      "academicYear": this.selectedJobData.academicYear,
      "studentInfo": this.uploaded_Excel_data,
      "finalStatus": "Selected"
    }
    console.log('data', obj)
    this._postjobService.jobPostupdateRounds(obj).subscribe((response: any) => {
      console.log('Update Students:', response);

      this.uploaded_Excel_data = [];
      this.isFileSelected = false;
      this.enableUploadButton = false;
      this.fileName = '';
      this.getsselectedstatus();
    })
  }
  getsselectedstatus() {
    // console.log('Calling getstdsbydriveandstatus()');

    const obj = {
      "driveName": this.selectedJobData.jobName,
      "academicYear": this.selectedJobData.academicYear,
      "finalStatus": "Selected"
    }
    console.log(obj)
    this._postjobService.jobPoststdsbydriveandstatus(obj).subscribe((data: any) => {
      if (data.status) {
        this.eligle_students_selected = data.result.sort((a: any, b: any) =>
          (a.campusName?.toLowerCase() || '').localeCompare(b.campusName?.toLowerCase() || '')
        );
        this.delete_selected_students = data.result.flatMap((entry: any) => entry.students || [])

        console.log('Eligible Students:', this.eligle_students_selected);

        this.SelectedTotalStudents = this.eligle_students_selected.reduce(
          (acc: number, campus: any) => acc + campus.totalStudents,
          0
        );
        this.SelectedStudentsCount = this.eligle_students_selected.reduce(
          (acc: number, campus: any) => acc + campus.count,
          0
        );

      } else {
        this.eligle_students_selected = [];
        console.error('Unexpected response format:', data);
        alert(data.message || 'no students found.');
      }
    },
      (error: any) => {
        console.error('Error fetching students list:', error);
        this.eligle_students_selected = [];
        if (this.activeTabIndex === 3) {
          alert(error?.statusText || 'Error occurred while fetching eligible students.');
        }

      })

  }
  // deleteSelectedStudents() {
  //   if (!this.delete_selected_students?.length) {
  //     alert('No students to update attendance.');
  //     return;
  //   }

  //   const sucodeArray = this.delete_selected_students
  //     .filter(student => student?.sucode)
  //     .map(student => ({ suc: student.sucode }));

  //   if (!sucodeArray.length) {
  //     alert('No valid student codes found.');
  //     return;
  //   }

  //   const obj = {
  //     "drivename": this.selectedJobData.jobName,
  //     "academicYear": this.selectedJobData.academicYear,
  //     "studentInfo": sucodeArray,
  //     "finalStatus": "NA"
  //   }
  //   console.log('data', obj)
  //   // return;
  //   this._postjobService.jobPostupdateRounds(obj).subscribe(
  //     (response: any) => {
  //       console.log('API Response:', response);
  //       this.getsselectedstatus();
  //       alert('Status updated');

  //     },

  //   );

  // }

  deleteSelectedStudents(campusName: string) {
    // Filter students matching the campus
    const studentsToDelete = this.delete_selected_students?.filter(
      student => student?.sucode && student?.campusName === campusName
    );
  
    if (!studentsToDelete?.length) {
      alert(`No students found for campus: ${campusName}`);
      return;
    }
  
    const sucodeArray = studentsToDelete.map(student => ({ suc: student.sucode }));
  
    const obj = {
      drivename: this.selectedJobData.jobName,
      academicYear: this.selectedJobData.academicYear,
      studentInfo: sucodeArray,
      finalStatus: "NA"
    };
  
    console.log('Deleting selected students for:', campusName, obj);
  
    this._postjobService.jobPostupdateRounds(obj).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        alert(`Selected students removed for campus: ${campusName}`);
        this.getsselectedstatus(); // Refresh selected student data
      },
      error => {
        console.error('Error deleting selected students:', error);
        alert('Failed to update selected students.');
      }
    );
  }
  

  excelAttendanceupload() {
    const obj = {
      "drivename": this.selectedJobData.jobName,
      "academicYear": this.selectedJobData.academicYear,
      "studentInfo": this.uploaded_Excel_data,
      "attendanceStatus": "Yes"
    }
    console.log('data', obj)
    this._postjobService.jobPostupdateRounds(obj).subscribe((response: any) => {
      console.log('Update Students:', response);

      this.uploaded_Excel_data = [];
      this.isFileSelected = false;
      this.enableUploadButton = false;
      this.fileName = '';
      this.getAttendancestatus();
    })
  }
  getAttendancestatus() {
    console.log('Calling getstdsbydriveandstatus()');

    const obj = {
      "driveName": this.selectedJobData.jobName,
      "academicYear": this.selectedJobData.academicYear,
      "attendanceStatus": "Yes"
    }
    console.log(obj)
    this._postjobService.jobPoststdsbydriveandstatus(obj).subscribe((data: any) => {

      if (data.status) {
        this.students_attendance = data.result.sort((a: any, b: any) =>
          (a.campusName?.toLowerCase() || '').localeCompare(b.campusName?.toLowerCase() || '')
        );
        console.log('Eligible Students:', this.students_attendance);
        this.delete_students_attendance = data.result.flatMap((entry: any) => entry.students || [])

        this.attendenceTotalStudents = this.students_attendance.reduce(
          (acc: number, campus: any) => acc + campus.totalStudents,
          0
        );

        this.attendenceSelectedStudents = this.students_attendance.reduce(
          (acc: number, campus: any) => acc + campus.count,
          0
        );


      } else {
        this.students_attendance = [];
        console.error('Unexpected response format:', data);
        alert(data.message || 'no students found.');
      }
    },
      (error: any) => {
        console.error('Error fetching students list:', error);
        this.students_attendance = [];
        if (this.activeTabIndex === 2) {
          alert(error?.statusText || 'Error occurred while fetching eligible students.');
        }

      })

  }
  // deleteAttendance() {
  //   if (!this.delete_students_attendance?.length) {
  //     alert('No students to update attendance.');
  //     return;
  //   }

  //   const sucodeArray = this.delete_students_attendance
  //     .filter(student => student?.sucode)
  //     .map(student => ({ suc: student.sucode }));

  //   if (!sucodeArray.length) {
  //     alert('No valid student codes found.');
  //     return;
  //   }

  //   const obj = {
  //     "drivename": this.selectedJobData.jobName,
  //     "academicYear": this.selectedJobData.academicYear,
  //     "studentInfo": sucodeArray,
  //     "attendanceStatus": "NA"
  //   }
  //   console.log('data', obj)
  //   // return;
  //   this._postjobService.jobPostupdateRounds(obj).subscribe(
  //     (response: any) => {
  //       console.log('API Response:', response);
  //       alert('change status');
  //       this.getAttendancestatus();
  //     },

  //   );

  // }

  deleteAttendance(campusName: any) {
    if (!this.delete_students_attendance?.length) {
      alert('No students to update attendance.');
      return;
    }
  
    // Filter students by the selected campus
    const filteredStudents = this.delete_students_attendance.filter(
      student => student?.campusName === campusName && student?.sucode
    );
  
    if (!filteredStudents.length) {
      alert('No valid student codes found for selected campus.');
      return;
    }
  
    const sucodeArray = filteredStudents.map(student => ({ suc: student.sucode }));
  
    const obj = {
      drivename: this.selectedJobData.jobName,
      academicYear: this.selectedJobData.academicYear,
      studentInfo: sucodeArray,
      attendanceStatus: "NA"
    };
  
    console.log('Filtered data for deletion:', obj);
  
    this._postjobService.jobPostupdateRounds(obj).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        alert('Attendance status updated for campus: ' + campusName);
        this.getAttendancestatus();
      }
    );
  }
  

  drivestatusupdate() {
    const obj = {
      "drivename": this.selectedJobData.jobName,
      "driveStatus": "Completed"
    }
    console.log('data', obj)
    this._postjobService.jobPostdrivestatusupdate(obj).subscribe((data: any) => {
      console.log('Update Students:', data);
      alert(data.message || 'no students found.');

    },
      (error: any) => {
        console.error('Failed to update drive status:', error);
      }
    )
  }


  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }

  goBack(): void {
    if (this.showJobDetails) {
      this.showJobDetails = false; // Hide details instead of navigating
      setTimeout(() => this.filterJobs(), 100);
    } else {
      this.router.navigate(['/placements/postjob_list']); // Go back if details are not shown
    }
  }

  // Show more/less toggles for long text fields
  isExpanded = false;
  isExpandeddescription = false;
  isExpandedEligibilitynote = false;
  isExpandedselectionprocess = false;
  isExpandedselectioncriteria = false;
  isExpandeddrivenote = false;

  togglecompanyprofile() {
    this.isExpanded = !this.isExpanded;
  }
  togglejobDescription() {
    this.isExpandeddescription = !this.isExpandeddescription;
  }
  toggleeligibilitynote() {
    this.isExpandedEligibilitynote = !this.isExpandedEligibilitynote;
  }
  toggleselectionprocess() {
    this.isExpandedselectionprocess = !this.isExpandedselectionprocess;
  }
  toggleselectioncriteria() {
    this.isExpandedselectioncriteria = !this.isExpandedselectioncriteria;
  }
  toggledrivenote() {
    this.isExpandeddrivenote = !this.isExpandeddrivenote;
  }

}
