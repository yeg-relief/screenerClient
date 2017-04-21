import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { AboutComponent } from './user/about/about.component';
import { MasterScreenerComponent } from './user/master-screener/master-screener.component';
import { QuestionsComponent } from './user/master-screener/questions/questions.component';
import { QuestionsResolverService } from './user/master-screener/questions/questions-resolver.service';
import { ResultsComponent } from './user/master-screener/results/results.component';
import { HomeComponent } from './user/home/home.component';
import { BrowseComponent } from './user/browse/browse.component';
import { CategoryComponent } from './user/browse/category/category.component';
import { QuickLinksComponent } from './user/quick-links/quick-links.component';

const appRoutes: Routes = [
  { 
    path: 'master-screener', 
    component: MasterScreenerComponent,
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
  },
  { 
    path: 'browse-programs', component: BrowseComponent,
    children: [
      {
        path: ':category', component: CategoryComponent
      }
    ],
  },
  { path: 'home', component: HomeComponent },
  {
    path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule'
  },
  { path: 'about', component: AboutComponent},
  { path: 'quick-links', component: QuickLinksComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];


export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
