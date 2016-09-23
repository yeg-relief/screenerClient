import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterScreenerComponent } from './master-screener.component';
import { OverviewComponent } from './overview/overview.component';
import { routing } from './master-screener.routes';

@NgModule({
  imports: [
    CommonModule,
    routing
  ],
  declarations: [MasterScreenerComponent, OverviewComponent]
})
export class MasterScreenerModule { }
