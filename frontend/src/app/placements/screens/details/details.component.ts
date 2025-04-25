import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostjobService } from 'src/app/core/services/postjob.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  job_Post_List: any;
  selectedJobData: any;  // Variable to store selected job data
  showJobDetails: boolean = false;


  constructor(private http: HttpClient, private _postjobService: PostjobService, private router: Router) {}

  ngOnInit(): void {
    this._postjobService.JobPostList().subscribe(data => {
      console.log(data);
      this.job_Post_List = data;
    });
  }

  // Function to fetch job details
  fetchJobDetails(jobId: string): void {
    this.http.get(`http://10.70.3.164:7700/jobpost/getbyid/${jobId}`).subscribe(
      (data: any) => {
        this.selectedJobData = data[0];
        this.showJobDetails = true; 

        console.log(this.selectedJobData)
      },
      (error) => {
        console.error('Error fetching job details:', error);
      }
    );
  }

  // Helper function to get object keys for displaying
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  // Check if the value is an object to decide whether to display JSON or not
  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }
}
