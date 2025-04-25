import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { empportalApi, analysisApi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PostjobService {

  constructor(private http: HttpClient,) { }

  Campuslist(): Observable<any> {
    return this.http.get(`${analysisApi}/master/campus?inst=3`);
  }
  Departmentlist():Observable<any> {
    return this.http.get(`${analysisApi}/master/maincourse?inst_id=3`);
  }
  JobPostsubmit(body: any): Observable<any> {
    return this.http.post<any>(`${empportalApi}/jobpost/create`, body);
  }
  JobPostList(): Observable<any> {
    return this.http.get(`${empportalApi}/jobpost/list`);
  }
  JobPostListById(jobId:string): Observable<any> {
    return this.http.get(`${empportalApi}/jobpost/getbyid/${jobId}`);
  }
  student_reg_update(id: string, obj: any): Observable<any> {
    return this.http.put(`http://10.60.1.9:3006/api/student_declaration/updatedata/${id}`, obj);
  }
  
  JobPosteligiblestudents(body: any): Observable<any> {
    return this.http.post<any>(`${empportalApi}/eligiblestudents/studentsbycampusanddrive`, body);
  }
  jobPostupdateRounds(body: any): Observable<any> {
    return this.http.post<any>(`${empportalApi}/jobpost/updateround`, body);
  }
  jobPoststdsbydriveandstatus(body: any): Observable<any> {
    return this.http.post<any>(`${empportalApi}/jobpost/stdsbydriveandstatus`, body);
  }
  jobPostdrivestatusupdate(body: any): Observable<any> {
    return this.http.post<any>(`${empportalApi}/jobpost/drivestatusupdate`, body);
  }
  jobdrivestatus(body: any): Observable<any> {
    return this.http.post<any>(`${empportalApi}/jobpost/drivesummary`, body);
  }
  uploadFileToUrl(file: File, uploadUrl: string, uploadPath: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', uploadPath);

    return this.http.post(uploadUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Upload failed:', error);
        return throwError(() => new Error('Upload failed'));
      })
    );
  }
}
