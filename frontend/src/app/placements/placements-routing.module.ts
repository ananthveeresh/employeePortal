import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlacementsModule } from './placements.module';
import { ScreensComponent } from './screens/screens.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { PostjobComponent } from './screens/postjob/postjob.component';
import { PostjobListComponent } from './screens/postjob-list/postjob-list.component';
import { StdinfoComponent } from './screens/stdinfo/stdinfo.component';
import { DetailsComponent } from './screens/details/details.component';
import { DrivesComponent} from './screens/drives/drives.component';
import { EligibleComponent } from './screens/eligible/eligible.component';

const routes: Routes = [{
  path:'',
  component:ScreensComponent,
  children:[
    {
      path:'',
      component: DashboardComponent
    },
      {
      path:'dashboard',
      component: DashboardComponent
    },
    
    {
      path:'postjob',
      component: PostjobComponent
    },
    {
      path:'postjob_list',
      component: PostjobListComponent
    },
    {
      path:'stdinfo',
      component: StdinfoComponent
    },
    // {
    //   path:'details',
    //   component: DetailsComponent
    // },
    // {
    //   path:'eligible',
    //   component: EligibleComponent
    // }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacementsRoutingModule { }
