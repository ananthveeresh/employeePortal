import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http'
import { Observable, Observer } from 'rxjs'
import {  empportalApi } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class HomeWorkService {

  constructor(private readonly _http: HttpClient,  ) { }

  section_list(obj:any): Observable<any> {
    return this._http.get<any>(empportalApi+`/homework/mastersections/`+obj.campusid+`/`+obj.yearid);
  }

  subject_list(id:any): Observable<any> {
    return this._http.get<any>(empportalApi+`/homework/sectionsubjects/${id}`);
  }

  home_work_create(body: any): Observable<any> {
    return this._http.post<any>(empportalApi+`/homework/create`, body);
  }

  uploadFile(file: File, filePath: any) {
    const token = '9cf742e6-4d25-4b73-acfe-648911a804e8';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', filePath); // Append the file path


    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this._http.post('https://apis.aditya.ac.in/filevault/upload', formData, { headers: headers });
  }

  // homework_list_by_date_(Date:any): Observable<any> {
  //   return this._http.get<any>(empportalApi+`/homework/listbydate/${Date}`);
  // }

  homework_list_delete_by_id(id:any): Observable<any> {
    return this._http.delete<any>(empportalApi+`/homework/delete/${id}`);
   
  }


  homework_list_total(): Observable<any> {
    return this._http.get<any>(empportalApi+`/homework/list`);
  }

  homework_notify(): Observable<any> {
    return this._http.get<any>(empportalApi+`/notifications/list`);
  }

  event_category_list(): Observable<any> {
    return this._http.get<any>(empportalApi+`/eventcategory/list`);
  }

  section_wise_std_list(obj: any): Observable<any> {
    return this._http.post<any>(empportalApi+`/homework/getsectionwisestudentslist`, obj);
  }

  section_wise_status_submit(obj: any): Observable<any> {
    return this._http.post<any>(empportalApi+`/studentstatus/create`, obj);
  }

  section_wise_status_list(): Observable<any> {
    return this._http.get<any>(empportalApi+`/studentstatus/list`);
  }

  homework_list_update(dt_id: any, dt_obj: any): Observable<any> {
    return this._http.post<any>(empportalApi+`/homework/update/`+dt_id, dt_obj);
  }

  status_Delete(obj:any): Observable<any> {
    return this._http.post<any>(empportalApi+`/studentstatus/delete`, obj);
  }

  student_status_list(date:any,paycode:any): Observable<any> {
    return this._http.get<any>(empportalApi+`/studentstatus/statuslist/${date}/${paycode}`);
  }

  std_intimation_sec_wise_submit(obj:any): Observable<any> {
    return this._http.post<any>(empportalApi+`/studentstatus/create`,obj);
  }
 
}
