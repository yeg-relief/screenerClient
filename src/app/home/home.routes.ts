import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeContentComponent } from './home-content/home-content.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: '', component: HomeContentComponent },
]);
