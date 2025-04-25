import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http'
import { Observable, Observer } from 'rxjs'
import {  empportalApi, payrollApi, analysisApi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ExamMarksEntryService {

  constructor(private readonly _http: HttpClient) { }


  exam_sections(paycode: any): Observable<any> {
    return this._http.get<any>(`${analysisApi}/faculty/getempsections/${paycode}`);
  }

  exam_all_sections(year_id:any,campus_id:any): Observable<any> {
    return this._http.get<any>(`${analysisApi}/master/section?year=${year_id}&campus=${campus_id}`);
  }

  class_teachers(section_id: any): Observable<any> {
    return this._http.get<any>(`${analysisApi}/faculty/getclassteacher/${section_id}`);
  }


  exams_list(body: any): Observable<any> {
    return this._http.post<any>(`${analysisApi}/exams/examslist`, body);
  }

  exams_sec_sub(body: any): Observable<any> {
    return this._http.post<any>(`${analysisApi}/exams/examsecsubjects`, body);
  }

  sec_students(body: any): Observable<any> {
    return this._http.post<any>(`${analysisApi}/student/getsectionwisestudentslist`, body);
  }

  grades_by_examtype(body: any): Observable<any> {
    return this._http.post<any>(`${empportalApi}/gradescale/getone`, body);
  }

  get_gradeby_inst_campus(body: any): Observable<any> {
    return this._http.post<any>(`${empportalApi}/gradescale/instandcmpwise`, body);
  }

  exam_marks_sub_entry(body: any): Observable<any> {
    return this._http.post<any>(`${empportalApi}/exammarks/subjectentry`, body);
 }

 exam_sub_marks(body: any): Observable<any> {
  return this._http.post<any>(`${empportalApi}/exammarks/subjectmarks`, body);
}

std_exam_result(sec_id:any,examid:any,succode:any): Observable<any> {
  return this._http.get<any>(`${empportalApi}/exammarks/studentreportcard/${sec_id}/${examid}/${succode}`);
}

generate_report_card(body: any): Observable<any> {
  return this._http.post<any>(`${empportalApi}/exammarks/generatereportcard`, body);
}

marks_entry_create(body: any): Observable<any> {
  return this._http.post<any>(`${empportalApi}/exammarks/marksentrycreation`, body);
}

// employee_data(): Observable<any> {
//   return this._http.get<any>(`${payrollApi}/employeemaster/employeedata/LAKSHYA`);
// }

student_attendance(body: any): Observable<any> {
  return this._http.post<any>(`${analysisApi}/student/rangeattendance`, body);
}

inst_master(): Observable<any> {
  return this._http.get<any>(`${analysisApi}/master/institute/`);
}

year_master(): Observable<any> {
  return this._http.get<any>(`${analysisApi}/master/year/`);
}

layout_type(): Observable<any> {
  return this._http.get<any>(`${empportalApi}/layouts/`);
}

get_one_layout(layout_name: string): Observable<any> {
  return this._http.get<any>(`${empportalApi}/layouts/filter/${layout_name}`);
}

download_pdf(body: any): Observable<any> {
  return this._http.post<any>(`${empportalApi}/exammarks/downloadpdf`, body);
}

pushtoanalysis(body: any): Observable<any> {
  console.log(body)
  return this._http.post<any>(`${empportalApi}/exammarks/pushtoanalysis`, body);
}


}
