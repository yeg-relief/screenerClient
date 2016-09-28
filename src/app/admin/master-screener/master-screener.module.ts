import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterScreenerComponent } from './master-screener.component';
import { OverviewComponent } from './overview/overview.component';
import { routing } from './master-screener.routes';
import { ScreenerStatsComponent } from './overview/screener-stats/screener-stats.component';
import { MasterScreenerDataService } from './master-screener-data.service';
import { ControlsComponent } from './overview/controls/controls.component';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { KeyComponent } from './overview/key/key.component';
import { QuestionComponent } from './overview/question/question.component';
import { EditComponent } from './edit/edit.component';
import { MdProgressCircleModule } from '@angular2-material/progress-circle';

@NgModule({
  imports: [
    CommonModule,
    routing,
    MdCheckboxModule.forRoot(),
    MdProgressCircleModule.forRoot(),
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
