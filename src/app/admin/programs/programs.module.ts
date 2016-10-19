import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramsComponent } from './programs.component';
import { ProgramOverviewComponent } from './program-overview/program-overview.component';
import { routing } from './programs.routes';

@NgModule({
  imports: [
    CommonModule,
    routing
  ],
  declarations: [ProgramsComponent, ProgramOverviewComponent]
})
export class ProgramsModule { }
