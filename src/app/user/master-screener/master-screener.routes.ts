import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuestionsComponent } from './questions/questions.component';
import { ResultsComponent } from './results/results.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  {
    path: 'questions', component: QuestionsComponent
  },
  {
    path: 'results', component: ResultsComponent
  }
]);
