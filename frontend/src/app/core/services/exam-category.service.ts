import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http'
import { Observable, Observer } from 'rxjs'
import {  empportalApi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ExamCategoryService {

  constructor(private readonly _http: HttpClient,) { }


  getinstitutelist(): Observable<any> {
    return this._http.get<any>(empportalApi+`/master/institute`);
  }


  exam_category_create(body: any): Observable<any> {
    return this._http.post<any>(empportalApi+`/examcategory/create`, body);
  }

  exam_category_list(): Observable<any> {
    return this._http.get<any>(empportalApi+`/examcategory/list`);
  }

  exam_category_update(id:any,body: any): Observable<any> {
    return this._http.post<any>(empportalApi+`/examcategory/update/${id}`, body);
  }

  exam_category_delete(id:any,body: any): Observable<any> {
    return this._http.delete<any>(empportalApi+`/examcategory/delete/${id}`, body);
  }



}
