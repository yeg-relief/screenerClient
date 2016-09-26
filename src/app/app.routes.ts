import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterScreenerComponent } from './master-screener/master-screener/master-screener.component';
import { HomeContentComponent } from './home/home-content/home-content.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { ResultsComponent } from './master-screener/results/results.component';
import { QuestionsComponent } from './master-screener/questions/questions.component';
import { BrowseComponent } from './browse/browse.component';
import { CategoryComponent } from './browse/category/category.component';

const appRoutes: Routes = [
  { path: 'master-screener', component: MasterScreenerComponent,
    children: [
      {
        path: 'questions', component: QuestionsComponent
      },
      {
        path: 'results', component: ResultsComponent
      },
      {
        path: '', pathMatch: 'full', redirectTo: '/master-screener/questions'
      },
      {
        path: '**', component: PageNotFoundComponent
      }
    ]
  },
  { path: 'browse-programs', component: BrowseComponent,
    children: [
      {
        path: ':category', component: CategoryComponent
      },
      {
        path: '**', component: PageNotFoundComponent
      }
    ]
  },
  {
    path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule'
  },
  { path: 'home', component: HomeContentComponent },
  { path: '', pathMatch: 'full', redirectTo: '/home'},
  { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
