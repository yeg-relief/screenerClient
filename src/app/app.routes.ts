import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const appRoutes: Routes = [
  { path: 'master-screener', loadChildren: 'app/user/master-screener/master-screener.module#MasterScreenerModule'},
  { path: 'browse-programs', loadChildren: 'app/user/browse/browse.module#BrowseModule' },
  {
    path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule'
  },
  { path: 'home', loadChildren: 'app/user/home/home.module#HomeModule'},
  { path: '', pathMatch: 'full', redirectTo: '/home/content'},
  { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
