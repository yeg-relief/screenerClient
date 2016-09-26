import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowseComponent } from './browse.component';
import { CategoryComponent } from './category/category.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  {
    path: 'category', component: BrowseComponent,
    children: [
      {
        path: ':category', component: CategoryComponent
      }
    ]
  },
  { path: 'category', pathMatch: 'full', redirectTo: 'category/all'}
]);
