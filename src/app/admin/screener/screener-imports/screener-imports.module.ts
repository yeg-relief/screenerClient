import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterScreenerModule } from '../../../user/master-screener/master-screener.module'

@NgModule({
  imports: [
    CommonModule,
    MasterScreenerModule
  ],
  exports: [
    MasterScreenerModule
  ]
})
export class ScreenerImportsModule { }
