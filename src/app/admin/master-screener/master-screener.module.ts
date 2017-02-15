import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MasterScreenerComponent } from './master-screener.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    MasterScreenerComponent,
  ],
})
export class MasterScreenerModule { }
