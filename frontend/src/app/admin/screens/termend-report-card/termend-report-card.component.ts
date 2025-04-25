import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CbseTermendService } from 'src/app/core/services/cbse-termend.service';
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { ExamMarksEntryService } from 'src/app/core/services/exam-marks-entry.service';



@Component({
  selector: 'app-termend-report-card',
  templateUrl: './termend-report-card.component.html',
  styleUrls: ['./termend-report-card.component.css']
})
export class TermendReportCardComponent {

  stdinfo: any;
  filteredExamResult1: any[];
  filteredExamResult2: any[];
  block0: any;
  block3: any;
  block4: any;
  block5: any;
  selectedLayoutImage: any;
  studentId: string;
  exam_id: any;
  suc_code: any;
  sec_id: any;
  teacherSignature: any;


  constructor(private http: HttpClient, private _exam_marks_entry_Service: ExamMarksEntryService, private _cbsetermendService: CbseTermendService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      this.exam_id = this.route.snapshot.params["examid"];
      this.suc_code = this.route.snapshot.params["succode"];
      this.sec_id = this.route.snapshot.params["sectionid"];
      this._exam_marks_entry_Service.std_exam_result(this.sec_id, this.exam_id, this.suc_code).subscribe((response: any) => {
        this.stdinfo = response.result[0];
        // console.log(this.stdinfo)
        this.filteredExamResult1 = this.stdinfo.exam_result.filter((subjectData: any) => subjectData.subject !== 'ICT');
        this.filteredExamResult2 = this.stdinfo.exam_result.filter((subjectData: any) => subjectData.subject === 'ICT');
        const termAdditionalMarks = this.stdinfo.term_aditional_marks;
        this.block0 = termAdditionalMarks.find((block: any) => block.title === 'block-0');
        this.block3 = termAdditionalMarks.find((block: any) => block.title === 'block-3');
        this.block4 = termAdditionalMarks.find((block: any) => block.title === 'block-4');
        this.block5 = termAdditionalMarks.find((block: any) => block.title === 'block-5');
        this._exam_marks_entry_Service.get_one_layout(this.stdinfo.report_layout).subscribe((response: any) => {
          const layoutInfo = response[0];
          this.selectedLayoutImage = layoutInfo.layout_path + 'img/' + layoutInfo.bg_image;
          if (layoutInfo.signature != '' && layoutInfo.signature != undefined) {
            this.teacherSignature = layoutInfo.layout_path + 'img/' + layoutInfo.signature;
            // this.teacherSignature = './assets/img/'+ data[0].signature;
          } else {
            this.teacherSignature = ""
          }
        })
      });
    });
  }

  printDiv(divId: string) {
    let printContents = document.getElementById(divId)?.innerHTML;
    let originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      location.reload(); // Reload to restore the original contents after printing
    } else {
      console.error(`Div with id ${divId} not found.`);
    }
  }

}
