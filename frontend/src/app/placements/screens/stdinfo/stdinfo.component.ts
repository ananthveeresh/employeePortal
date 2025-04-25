import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stdinfo',
  templateUrl: './stdinfo.component.html',
  styleUrls: ['./stdinfo.component.css']
})
export class StdinfoComponent {
  sucCode: number | null = null;
  student: any = null;
  showDetails: boolean = false;

  constructor(private http: HttpClient) {}

  searchStudent() {
    console.log(this.sucCode);
    if (!this.sucCode) return;
  
    const apiUrl = `http://10.60.1.9:3006/api/student_declaration/studentdata/${this.sucCode}`;
    console.log(apiUrl);
  
    this.http.get(apiUrl).subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          console.log(res);
          this.student = res[0];
          this.showDetails = true;
        } else {
          // Case when response is empty
          console.warn('No student data found');
          this.student = null;
          this.showDetails = false;
          alert('Student not found');
        }
      },
      error: (err) => {
        console.error('Error fetching student data:', err);
        this.student = null;
        this.showDetails = false;
        alert('Student not found or error fetching data');
      }
    });
  }
  
  printStudentDetails() {
    const printContent = document.getElementById('print-section');
    const originalContents = document.body.innerHTML;
  
    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
    }
  }
  
}



