// import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClientModule,HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { BrowserModule } from '@angular/platform-browser';
// import { CommonModule } from '@angular/common';

// import { AppRoutingModule,routingComponents } from './app-routing.module';
// import { AppComponent } from './app.component';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { LoginComponent } from './login/login.component';

// import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
// import {
//   GoogleLoginProvider
// } from '@abacritt/angularx-social-login';
// import { HeadersInterceptor } from './interceptor/headers.interceptor';
// import { googleclientID } from './utilities/socialauth';
// import { SharedModule } from './shared/shared.module';
// import { HashLocationStrategy, LocationStrategy } from '@angular/common';
// import {DataTablesModule} from 'angular-datatables';
// import { RegistrationComponent } from './registration/registration.component';
// import { NgSelectModule } from "@ng-select/ng-select";
// import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';

// @NgModule({
  
//   declarations: [
//     AppComponent,
//     LoginComponent,
//     RegistrationComponent,
//     ForgetpasswordComponent,
    
//   ],
//   imports: [
//     HttpClientModule,
//     BrowserModule,
//     AppRoutingModule,
//     ReactiveFormsModule,
//     SocialLoginModule,
//     routingComponents,
//     SharedModule,
//     CommonModule,
//     DataTablesModule,
//     NgSelectModule,
//     FormsModule
//   ],
//   providers: [
//     {provide: LocationStrategy, useClass:HashLocationStrategy},
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: HeadersInterceptor,
//       multi: true
//   },HttpClient,
  
//     {
//       provide: 'SocialAuthServiceConfig',
//       useValue: {
//         autoLogin: false,
//         providers: [
//           {
//             id: GoogleLoginProvider.PROVIDER_ID,
//             provider: new GoogleLoginProvider(
//               googleclientID
//             )
//           }
//         ],
//         onError: (err) => {
//           console.error(err);
//         }
//       } as SocialAuthServiceConfig,
//     }
  
//   ],
//   bootstrap: [AppComponent],
//   schemas: [ NO_ERRORS_SCHEMA ]
// })
// export class AppModule { }


import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Routing
import { AppRoutingModule, routingComponents } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';

// Modules
import { SharedModule } from './shared/shared.module';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from "@ng-select/ng-select";

// Services & Interceptors
import { HeadersInterceptor } from './interceptor/headers.interceptor';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { googleclientID } from './utilities/socialauth';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    ForgetpasswordComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SocialLoginModule,
    DataTablesModule,
    NgSelectModule,
    SharedModule,
    routingComponents,
  ],
  providers: [
    HttpClient,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(googleclientID),
          },
        ],
        onError: (err) => console.error(err),
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}