import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeContentComponent } from './home-content/home-content.component';
import { HomeComponent } from './home.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  {
    path: '', component: HomeComponent,
    children: [
      {
        path: 'content', component: HomeContentComponent
      }
    ]
  },
  {
    path: '', pathMatch: 'full', redirectTo: '/home/content'
  }
]);
