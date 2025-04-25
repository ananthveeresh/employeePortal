import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, Observer } from 'rxjs'
import { Router } from '@angular/router'
import { EventService } from './eventlog.service';
import { empportalApi,analysisApi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router, private _eventservice: EventService) { }


  // ************************ Login Api ****************** 
  post_login(obj: any): Observable<any> {
    // console.log(obj)
    // console.log(empportalApi+`/homework/verifylogin`)
    return this._http.post<any>(empportalApi+`/homework/verifylogin`, obj)
  }

  // ************************ Register Api ****************** 
  post_register(body: any): Observable<any> {
    return this._http.post<any>(empportalApi+`/homework/empregister`, body);
  }

  

  logout(stddata: any): void {

    const videoPlayMongo =
    {
      "userId": stddata.stdSuc,
      "eventCategory": 'Logout',
      "eventDetails": stddata,
      "title1": "Logout",
      "result": "Logout"
    }
    // this._eventservice.post_event(videoPlayMongo).subscribe(
    //   (eventdata: any) => { })
    localStorage.clear();
   // window.location.href = "https://abhyas.ai/beta/#/login";
  }
 
  changePassword(body:any){
    return this._http.post<any>(empportalApi+`/homework/changepassword`, body);

  }

  current_year(): Observable<any> {
    return this._http.get<any>(analysisApi+`/master/year?currentyear=0`);
  }
  master_year_id(): Observable<any> {
    return this._http.get<any>(analysisApi+`/master/year?type=0`);
  }

}
