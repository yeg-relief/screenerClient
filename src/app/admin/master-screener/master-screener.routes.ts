import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { EditComponent } from './edit/edit.component';
import { MasterScreenerComponent } from './master-screener.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { EditConditionalComponent } from './edit-conditional/edit-conditional.component';
import { EditQuestionGuardService } from './edit-question/edit-question.guard.service';
import { ConditionalGuardService } from './edit-conditional/guard.service';
import { EditQuestionResolverService } from './edit-question/edit-question-resolver.service';


export const MasterScreenerRoutes = [
  {
    path: 'master-screener/question/edit/:version/:key', 
    component: EditQuestionComponent, 
    //canActivate: [EditQuestionGuardService],
    resolve: {
      question: EditQuestionResolverService
    }
  },
  {
    path: 'master-screener/question/edit/conditionals/:version/:key', component: EditConditionalComponent, canActivate: [ConditionalGuardService]
  }
];
