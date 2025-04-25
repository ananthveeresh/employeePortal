import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  public logininfo: any = [];
  public stdprograminfo: any = [];
  public togglevalue: Number = 0;
  public errorimg: any = String;
  imageData: any;
  selectedfiletype: any;
  logininfo_yr: any;
  year_id_filter : any;
  master_year_ID: any;
  login_year_ID: any




  constructor(private _authenticationService: AuthenticationService, private _http: HttpClient, private sanitizer: DomSanitizer, private router:Router) { }



  menuchange() {

    const box = document.getElementById('appbody');

    if (this.togglevalue == 0) {
      box?.classList.add('toggle-sidebar');
      this.togglevalue = 1;
    } else {
      box?.classList.remove('toggle-sidebar');
      this.togglevalue = 0;
    }
  }
  selectmobilemenu: number;

  ngOnInit() {
    this.selectmobilemenu = 0
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo);
    this.logininfo_yr = localStorage.getItem("logindata_yr");
    this.logininfo_yr = JSON.parse(this.logininfo_yr);
    this.errorimg = "assets/img/profile.jpg";

    if (this.logininfo) {
      this.get_image(this.logininfo);
    }

    this._authenticationService.master_year_id().subscribe((data) => {
      // console.log(data)
      this.master_year_ID = data
      this.year_id_filter = this.master_year_ID.filter((e: { current_year: any }) => e.current_year == -1 || e.current_year == 0 || e.current_year == 1)
      // console.log(this.year_id_filter)
  
    })


  
  }

  year_change(year_name:any){
    console.log(year_name)
    var seletedyear = this.year_id_filter.filter((e: { year_name: any }) => e.year_name == year_name);
    console.log(seletedyear)
    localStorage.setItem('logindata_yr', JSON.stringify(seletedyear));
    this.logininfo_yr = localStorage.getItem("logindata_yr");
    this.logininfo_yr = JSON.parse(this.logininfo_yr);

      }

  logout(): void {
    this._authenticationService.logout(this.logininfo);
  }


  gotomenu(x: number) {
    this.selectmobilemenu = x
  }

  get_image(file_data: any) {
    // // console.log(file_data)
    const token = '9cf742e6-4d25-4b73-acfe-648911a804e8';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);


    if(file_data.photoId!=undefined){
      const url = 'https://apis.aditya.ac.in/filevault/download/' + file_data.photoId;

      this._http.get(url, { headers, responseType: 'blob' }).subscribe((data: Blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageData = reader.result as string;
          if (this.selectedfiletype == 'pdf') {
            this.imageData = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageData)
          } else {
            this.imageData = this.imageData;
          }
          // // console.log(this.imageData);
        };
        reader.readAsDataURL(data);
      }, (error: HttpErrorResponse) => {
        console.error('Error downloading image:', error);
      });
    }
  }

  getDashboardLink(): string {
    // Check current route to determine module
    return this.router.url.includes('/placements') 
      ? '/placements/dashboard' 
      : '/admin/dashboard';
  }

}
