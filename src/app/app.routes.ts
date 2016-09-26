import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const appRoutes: Routes = [
  /*
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
  */
  { path: 'master-screener', loadChildren: 'app/master-screener/master-screener.module#MasterScreenerModule'},
  { path: 'browse-programs', loadChildren: 'app/browse/browse.module#BrowseModule' },
  {
    path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule'
  },
  { path: 'home', loadChildren: 'app/home/home.module#HomeModule'},
  { path: '', pathMatch: 'full', redirectTo: '/home'},
  { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
