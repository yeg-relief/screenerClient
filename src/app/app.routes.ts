import { provideRouter, RouterConfig } from '@angular/router';
import { MasterScreenerComponent } from './master-screener';
import { HomeComponent } from './home';

export const routes: RouterConfig = [
  { path: '', component: HomeComponent },
  { path: 'master-screener', component: MasterScreenerComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];