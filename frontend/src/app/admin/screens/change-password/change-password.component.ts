import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "src/app/core/services/authentication.service";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"],
})
export class ChangePasswordComponent implements OnInit {
  public chng_pwd_btn = false;
  public notmatch_error: any;
  public logininfo: any;
  public post_msg: any;

  changepassword: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _authenticationService: AuthenticationService
  ) {
    this.changepassword = this.fb.group({
      oldPswd: ["", [Validators.required]],
      newPswd: ["", [Validators.required]],
      confirmPswd: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.logininfo = localStorage.getItem("logindata");
    this.logininfo = JSON.parse(this.logininfo);
    // // console.log(this.logininfo);
  }

  checkPswd() {
    this.post_msg = {};
    const oldPswd = this.changepassword.value.oldPswd;
    const newPswd = this.changepassword.value.newPswd;
    const confirmPswd = this.changepassword.value.confirmPswd;

    if (!oldPswd || !newPswd || !confirmPswd) {
        this.chng_pwd_btn = false;
        this.notmatch_error = "Please enter all fields";
        return;
    }

    if (oldPswd.length < 6 || newPswd.length < 6 || confirmPswd.length < 6) {
        this.chng_pwd_btn = false;
        this.notmatch_error = "PIN must be at least 6 characters long";
        return;
    }

    if (oldPswd === newPswd) {
        this.chng_pwd_btn = false;
        this.notmatch_error = "New PIN cannot be the same as the old PIN";
    } else if (newPswd === confirmPswd) {
        this.chng_pwd_btn = true;
        this.notmatch_error = "";
        this.post_msg.msg = "";
    } else {
        this.chng_pwd_btn = false;
        this.notmatch_error = "Confirm PIN does not match with new PIN";
    }
  }


  Onsubmit() {
    // // console.log(this.changepassword.value)

    var obj = {
      paycode: this.logininfo.paycode,
      mobile: this.logininfo.mobileNo,
      oldpwd: this.changepassword.value.oldPswd,
      newpwd: this.changepassword.value.confirmPswd,
    };
    // // console.log(obj)
    this._authenticationService.changePassword(obj).subscribe((data) => {
      // console.log(data)
      this.post_msg = data;
      if (this.post_msg.data.nModified == 1) {
        window.location.href = "#/admin";
      }
    });
  }
}
