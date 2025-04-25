import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlacementsRoutingModule } from './placements-routing.module';
import { MenuComponent } from './menu/menu.component';
import { ScreensComponent } from './screens/screens.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { PostjobComponent } from './screens/postjob/postjob.component';
import { NgSelectModule } from "@ng-select/ng-select";
import { PostjobListComponent } from './screens/postjob-list/postjob-list.component';
import { DetailsComponent } from './screens/details/details.component';
import { DrivesComponent } from './screens/drives/drives.component';
import { EligibleComponent } from './screens/eligible/eligible.component';
import { StdinfoComponent } from './screens/stdinfo/stdinfo.component';



@NgModule({
  declarations: [
    MenuComponent,
    ScreensComponent,
    DashboardComponent,
    PostjobComponent,
    PostjobListComponent,
    DetailsComponent,
    DrivesComponent,
    EligibleComponent,
    StdinfoComponent,
  ],
  imports: [
    CommonModule,
    PlacementsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    HttpClientModule

  ]
})
export class PlacementsModule { }
