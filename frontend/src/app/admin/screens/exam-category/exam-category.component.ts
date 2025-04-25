import { Component , OnInit} from '@angular/core';
import { ExamCategoryService } from 'src/app/core/services/exam-category.service';
import { FormBuilder,FormControl , FormGroup, Validators } from "@angular/forms";


@Component({
  selector: 'app-exam-category',
  templateUrl: './exam-category.component.html',
  styleUrls: ['./exam-category.component.css']
})
export class ExamCategoryComponent  implements OnInit{
  logininfo: any = [];
  success: any;
  exam_Cat_Data: FormGroup;
  Update_exam_Cat_Data: FormGroup;
  delete_exam_Cat_Data : FormGroup;
  exam_Category_List: any;
  update_id: any;
  exam_category_Update: any;
  exam_category_Create: any;
  institutelist:any=[]
  ShowData = 0;
  updated_Data: any;
  institute_name: ""



  constructor(
    private _examCategoryService: ExamCategoryService,private fb: FormBuilder
  
  ) {
    this.exam_Cat_Data = this.fb.group({
      categoryname: ["", [Validators.required]],
      categorycode: ["", [Validators.required]],
      institute_name: ["", [Validators.required]],
    });

    this.Update_exam_Cat_Data = this.fb.group({
      categoryname: [''],
      categorycode: [''],
      institute_name: [''],
    });
    
    this.delete_exam_Cat_Data = this.fb.group({
      categoryname: [''],
      categorycode: [''],
      institute_name: [''],
    });

  }

  ngOnInit(): void {
    this.ShowData = 1
    this.logininfo = localStorage.getItem("logindata");
    this.logininfo = JSON.parse(this.logininfo);
    // // console.log(this.logininfo)

    this._examCategoryService.getinstitutelist().subscribe((data: any) => {
      //  // console.log(data)
      this.institutelist = data;
      // console.log(this.institutelist)
    });
  
    this._examCategoryService.exam_category_list().subscribe((data: any) => {
      // console.log(data)
      this.exam_Category_List = data
       // console.log(this.exam_Category_List)
    });

    

  }

  

  onSubmit() {
    this.ShowData = 1

     var institueinfo = this.institutelist.filter((e: { id: any; }) =>e.id == this.exam_Cat_Data.value.institute_name)
     // console.log(institueinfo)
        var obj ={
          
            "categoryname":  this.exam_Cat_Data.value.categoryname,
            "categorycode" : this.exam_Cat_Data.value.categorycode,
            "inst_master":[{
             "id": institueinfo[0].id,
              "institute_name":  institueinfo[0].institute_name 
            }]
        
        }
        // console.log(obj)
     // console.log(obj)
        this._examCategoryService.exam_category_create(obj).subscribe((data: any) => {
          alert('Date Submitted Successfully!')
          // location.reload();
          
        });
    
  }

  update_list(x: any) {
this.ShowData = 2;
this.update_id  = x._id;
// console.log(this.update_id)

    this.Update_exam_Cat_Data.patchValue({
      categoryname: x["categoryname"],
      categorycode: x["categorycode"],
      institute_name: x["institute_name"]
    });

  }

  delete_list(x:any){
    this.update_id  = x._id;
    // console.log(this.update_id)
    
        this.delete_exam_Cat_Data.patchValue({
          categoryname: x["categoryname"],
          categorycode: x["categorycode"],
          institute_name: x["inst_master"][0]["institute_name"]
        });
    
      // console.log(this.delete_exam_Cat_Data)  
  var obj ={
    
      "categoryname": this.delete_exam_Cat_Data.value.categoryname,
      "categorycode": this.delete_exam_Cat_Data.value.categorycode,
      "inst_master": [
          {
              "id": this.update_id,
              "institute_name":this.delete_exam_Cat_Data.value.institute_name,

          }
      ]
  }
  
  // console.log(obj)

    this._examCategoryService.exam_category_delete(this.update_id,obj).subscribe((data: any) => {
      // console.log(data)
    
      alert('Delete Submitted Successfully!')
       location.reload();
    
      
    });
     

  }

  backbutton() {
    this.ShowData = 1;
    location.reload();
  }

  updateData(){

    var institueinfo = this.institutelist.filter((e: { id: any; }) =>e.id == this.Update_exam_Cat_Data.value.institute_name)
    // console.log(institueinfo)
    
var obj ={
  
    "categoryname": this.Update_exam_Cat_Data.value.categoryname,
    "categorycode": this.Update_exam_Cat_Data.value.categorycode,
    "inst_master": [
        {
            "id": institueinfo[0].id,
            "institute_name": institueinfo[0].institute_name
        }
    ]
}

// console.log(obj)
this._examCategoryService.exam_category_update(this.update_id,obj).subscribe((data: any) => {
  // console.log(data)

  alert('Date Submitted Successfully!')
   location.reload();

  
});

  
  }

  

  

}
