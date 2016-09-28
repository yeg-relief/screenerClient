import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterScreenerComponent } from './master-screener.component';
import { OverviewComponent } from './overview/overview.component';
import { routing } from './master-screener.routes';
import { ScreenerStatsComponent } from './overview/screener-stats/screener-stats.component';
import { MasterScreenerDataService } from './master-screener-data.service';
import { ControlsComponent } from './overview/controls/controls.component';
import { KeyComponent } from './overview/key/key.component';
import { QuestionComponent } from './overview/question/question.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  imports: [
    CommonModule,
    routing,
  ],
  declarations: [
    MasterScreenerComponent,
    OverviewComponent,
    ScreenerStatsComponent,
    ControlsComponent,
    KeyComponent,
    QuestionComponent,
    EditComponent
  ],
  providers: [
    MasterScreenerDataService
  ]
})
export class MasterScreenerModule { }
