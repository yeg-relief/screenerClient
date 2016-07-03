import { provideRouter, RouterConfig } from '@angular/router';
import { MasterScreenerComponent } from './master-screener/index';
import { HomeComponent } from './home/home.component';

export const routes: RouterConfig = [
  { path: '', component: HomeComponent },
  { path: 'master-screener', component: MasterScreenerComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];