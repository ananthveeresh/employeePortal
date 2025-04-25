import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { empportalApi, analysisApi } from "src/environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {

  constructor(private readonly _http: HttpClient) { }
  instMaster(): Observable<any> {
    return this._http.get(`${analysisApi}/master/institute`);
  }

  courserbyInst(instId:any): Observable<any> {
    return this._http.get(`${analysisApi}/master/maincourse?inst_id=${instId}`);
  }

  createEnquiry(enquiryData: any): Observable<any> {
    return this._http.post(`${empportalApi}/enquiries/create`, enquiryData);
  }
  getEnquiriesByUserId(userId: any): Observable<any> {
    return this._http.get(`${empportalApi}/enquiries/userwise/${userId}`);
  }
  updateEnquiry(enqid:any, enquiryData: any): Observable<any> {
    return this._http.post(`${empportalApi}/enquiries/updatebyid/${enqid}`, enquiryData);
  }
  uploadEnquiries(enquiryData: any): Observable<any> {
    return this._http.post(`${empportalApi}/enquiries/excelupload`, enquiryData);
  }
  getEnquiriesBySearch(searchobj:any): Observable<any> {
    return this._http.post(`${empportalApi}/enquiries/searchbykey`, searchobj);
  }
  findAadharNo(aadharNo:any): Observable<any> {
    return this._http.get(`${empportalApi}/enquiries/findaadharno/${aadharNo}`);
  }
  verifyStudent(stdobj:any): Observable<any> {
    return this._http.post(`${empportalApi}/enquiries/verifystudent/`, stdobj);
  }
  deleteStudent(mongoid:any): Observable<any> {
    return this._http.delete(`${empportalApi}/enquiries/delete/${mongoid}`);
  }
  getSummarybyUserId(acdYear:any, userid: any): Observable<any> {
    return this._http.get(`${empportalApi}/enquiries/campussummaryreport/${acdYear}/${userid}`);
  }
  filterEnquiries(obj:any): Observable<any> {
    return this._http.post(`${empportalApi}/enquiries/userwiseorcampus`, obj);
  }
}
