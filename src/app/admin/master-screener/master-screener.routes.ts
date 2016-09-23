import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { MasterScreenerComponent } from './master-screener.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'overview', component: OverviewComponent }
]);
