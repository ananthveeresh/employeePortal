import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextCapitalizePipe } from './services/text-capitalize.pipe';



@NgModule({
  declarations: [
    TextCapitalizePipe
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
