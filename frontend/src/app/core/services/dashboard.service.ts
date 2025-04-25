import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { empportalApi } from "src/environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  constructor(
    private readonly _http: HttpClient,
    private readonly _router: Router
  ) {}

  working(paycode: any): Observable<any> {
    return this._http.get<any>(
      empportalApi + "/homework/empattendance/" + paycode
    );
  }

  get_emp_details(paycode: any): Observable<any> {
    return this._http.get<any>(empportalApi+`/homework/empbasicinfo/${paycode}`
      
      // empportalApi + "/employeemaster/basicinfo/" + paycode
    );
  }

  inst_details (id: any){
    return this._http.get<any>('https://apis.aditya.ac.in/analysis/master/institute?id='+id)
  }
}
