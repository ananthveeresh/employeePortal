import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms'
import { AuthenticationService } from '../core/services/authentication.service';
import { EventService } from '../core/services/eventlog.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  ipAddress: string;
  device_info: any;
  master_Year: any
  ngOnInit() {

  }


  public show_log_error = '';

  logdata: FormGroup;
  constructor(private fb: FormBuilder, private _authenticationService: AuthenticationService, private router: Router, private _eventservice: EventService) {
    this.logdata = this.fb.group({
      employee_paycode: ['', [Validators.required, Validators.min(1000)]],
      employee_pwd: ['', [Validators.required]],
    });
  }

  onLogin() {
    // // console.log(this.logdata.value)
    let paycode = this.logdata.value.employee_paycode;
    let pwd = this.logdata.value.employee_pwd;

    var obj = {
      "paycode": paycode.toString().trim(),
      "pwd": pwd.trim()
    };
    //// console.log(obj); 
    this._authenticationService.post_login(obj).pipe(
      catchError((error) => {
        console.error('Login Error:', error);
        this.show_log_error = 'Login failed. Please check your credentials and try again.';
        return throwError(error);
      })
    ).subscribe(data => {
      // console.log(data);

      if (data.data && data.data.length > 0 && data.data[0].empStatus === 'Working' && data.data[0].designation === 'TRAINING & PLACEMENT OFFICER') {
        this.show_log_error = '';
        localStorage.setItem('logindata', JSON.stringify(data.data[0]));

        this._authenticationService.current_year().pipe(
          catchError((error) => {
            console.error('Error fetching current year:', error);
            this.show_log_error = 'Error loading academic year data.';
            return throwError(error);
          })
        ).subscribe((data: any) => {
          localStorage.setItem('logindata_yr', JSON.stringify(data));
          this.router.navigate(['/placements']);
        });

      }else if (data.data && data.data.length > 0 && data.data[0].empStatus === 'Working') {
        this.show_log_error = '';
        localStorage.setItem('logindata', JSON.stringify(data.data[0]));
    
        this._authenticationService.current_year().pipe(
          catchError((error) => {
            console.error('Error fetching current year:', error);
            this.show_log_error = 'Error loading academic year data.';
            return throwError(error);
          })
        ).subscribe((data: any) => {
          localStorage.setItem('logindata_yr', JSON.stringify(data));
          this.router.navigate(['/admin']);
        });
    
      } else {
        // console.log(data);
        this.show_log_error = data?.msg || 'Invalid username or password';
      }
    });


  }

  clearfunction() {
    this.show_log_error = '';
  }

  gotoForgot() {
    window.location.href = '#/forgetpassword'
  }

  @HostListener('document:keyup.enter', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.logdata.valid) {
      this.onLogin();
    }
  }

}


