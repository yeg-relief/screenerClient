import { provideRouter, RouterConfig } from '@angular/router';
import { MasterScreenerComponent } from './master-screener/index';
import { HomeComponent } from './home/index';

export const routes: RouterConfig = [
  { path: 'master-screener', component: MasterScreenerComponent },
  { path: '', component: HomeComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];