import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuestionsComponent } from './questions/questions.component';
import { ResultsComponent } from './results/results.component';
import { QuestionsResolverService } from './questions/questions-resolver.service';
import { MasterScreenerComponent } from './master-screener.component'


export const routing: ModuleWithProviders = RouterModule.forChild([
  {
    path: '', component: MasterScreenerComponent,
    children: [
      {
        path: 'questions', component: QuestionsComponent,
        resolve: {
          questions: QuestionsResolverService
        }
      },
      {
        path: 'results', component: ResultsComponent,
      }
    ]
  }
]);
