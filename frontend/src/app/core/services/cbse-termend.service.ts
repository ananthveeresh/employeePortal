import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http'
import { Observable, Observer } from 'rxjs'
import {  empportalApi, payrollApi, analysisApi } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class CbseTermendService {

  constructor(private readonly _http: HttpClient) { }

  cbsetermschema(body: any): Observable<any> {
    return this._http.post<any>(`${empportalApi}/cbsetermschema/getone`, body);
  }
  cbsetermtermend_multisubs(body: any): Observable<any> {
    return this._http.post<any>(`${empportalApi}/cbsetermend/multisubjects`, body);
  }
  std_exam_info(body: any): Observable<any> {
    return this._http.post<any>(`${empportalApi}/cbsetermend/studentexaminfo`, body);
  }
  insert_scholastic(body: any): Observable<any> {
    return this._http.post<any>(`${empportalApi}/cbsetermend/insertcoscholasic`, body);
  }

  reportcard(mongoid: string): Observable<any> {
    return this._http.get(`${empportalApi}/exammarks/mongo/${mongoid}`);
  }

}
