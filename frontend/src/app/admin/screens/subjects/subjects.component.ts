import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl,FormArray} from '@angular/forms';
import { SubjectsService } from 'src/app/core/services/subjects.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent {
  subjectsform:FormGroup;
  institutelist:any;
  subsubarry:any=[];
  subsubinputs :any=0;
  constructor(private fb:FormBuilder,private subjectscompservice:SubjectsService){
    this.subjectsform = this.fb.group({
      subjectname: ["", [Validators.required]],
      subjectcode: ["", [Validators.required]],
      subjecttype: ["", [Validators.required]],
      instituename: ["", [Validators.required]],
      subtopics:this.fb.array([]),
    });
    
  }

  ngOnInit():void{
    this.subjectscompservice.getinstitutelist().subscribe((data)=>{
      this.institutelist = data
      this.addnewSubsubject()
    })
  }

  subjectssubmit(){
    var institueinfo = this.institutelist.filter((e: { id: any; }) =>e.id == this.subjectsform.value.instituename)

    var obj={
      "subjectName":this.subjectsform.value.subjectname,
      "subjectCode":this.subjectsform.value.subjectcode,
      "subjectType":this.subjectsform.value.subjecttype,
      "subjectInfo":this.subjectsform.value.subtopics,
      "instMaster":{
        "id":institueinfo[0].id,
        "institute_name":institueinfo[0].institute_name
      }
    }
    // console.log(obj)

    this.subjectscompservice.addsubjectlist(obj).subscribe((response)=>{
      // console.log(response)
      if(response.length>0){
        location.reload();
      }else{
        alert("data not posted")
      }
    })
    
  }

  get subtopics():FormArray{
    return this.subjectsform.get("subtopics") as FormArray
  }

  newSubsubject():FormGroup{
    return this.fb.group({
      sub:''
    })
  }

  addnewSubsubject(){
    this.subtopics.push(this.newSubsubject());
    // console.log(this.subtopics)
  }
  
  removeSubsubject(i:number){
    this.subtopics.removeAt(i)
  }

}



