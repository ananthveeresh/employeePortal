import { Injectable } from '@angular/core';
import { ExamMarksEntryService } from 'src/app/core/services/exam-marks-entry.service'

@Injectable({
  providedIn: 'root'
})
export class GradeCalcService {
  grades: any;

  constructor(private _exam_marks_entry_Service: ExamMarksEntryService) { }

  getGrade(obj: any, callback: (grade: string) => void) {
    //  console.log(marks, inst,type);
    this._exam_marks_entry_Service.grades_by_examtype(obj).subscribe((data) => {
      //  console.log(data);
      this.grades = data[0].grade_scale;
      for (let i = 0; i < this.grades.length; i++) {
        const [min, max] = this.grades[i].marks_range.split('-').map(Number);
        if (obj.marks >= min && obj.marks <= max) {
          // console.log(this.grades[i].grade);
          callback(this.grades[i].grade);
          return;
        }
      }
      callback('Invalid');
    });
  }
}
