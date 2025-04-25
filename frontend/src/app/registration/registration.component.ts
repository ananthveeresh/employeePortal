import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms'
import { AuthenticationService } from '../core/services/authentication.service';
import { markFormGroupTouched } from '../utilities/MarkFormGroupAsTouched';
import { SocialAuthService } from '@abacritt/angularx-social-login';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  public show_suc = 1; 
  public show_suc_error = '';
  public register_success = 0;
  public show_suc_msg = '';
  public show_group_error = '';
  public show_reg_error = '';
  public stdsucdata = 10;
  public show_alert = 1;
  public quali_list : any =[]; 
  public selection_on_quali : any =[]; 
  public myModal: any;
  public joinbtnjs: boolean = false;
  registerform: FormGroup 
  suc_form: FormGroup  
  constructor(private fb: FormBuilder,private authService: SocialAuthService,private _authenticationService: AuthenticationService, private router: Router) { 
    this.registerform = this.fb.group({ 
      reg_emp_paycode:['',[Validators.required, Validators.min(1000)]],  

      reg_emp_mobile:['',[Validators.required, Validators.pattern('^[0-9]{10}$')]],  
    });
    
    this.suc_form = this.fb.group({ 
      stdSuc:[''],
    })
  }

  ngOnInit() {  
    // this._authenticationService.get_qualification_list().subscribe(data => { 
    //   this.quali_list = data;
    //   // // console.log(this.quali_list)
    // })  
  } 

  

 
  

  onSubmit(){  
    // console.log(this.registerform.value)
    if(this.registerform.value.reg_emp_mobile.toString().length!=10 || this.registerform.value.reg_emp_mobile==''){  
      this.show_reg_error = '* Fields are required'
    }else{

      let paycode = this.registerform.value.reg_emp_paycode;
      let mobile = this.registerform.value.reg_emp_mobile;
    
      var obj = {
          "paycode" : paycode,
          "mobile": mobile
      } 

      // console.log(obj)
    this._authenticationService.post_register(obj).subscribe(data => {
       // console.log(data)
      if (data.msg=='Invalid paycode and mobile number') { 
        this.show_reg_error = 'Invalid paycode and mobile number';
      }else{ 
          this.register_success = 1
          // alert("User registered Successfully..!")
          // window.location.href='#/login';
        }
      
    })

  }
  }
 
}
