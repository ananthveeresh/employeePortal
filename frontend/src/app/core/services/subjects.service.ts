import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import {  empportalApi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  constructor(private readonly http:HttpClient){}

  getinstitutelist(): Observable<any> {
    return this.http.get<any>(empportalApi+`/master/institute`);
  }

  addsubjectlist(body:any):Observable<any> {
    return this.http.post<any>(empportalApi+`/subject/create`,body);
  }

}
