import { provideRouter, RouterConfig } from '@angular/router';
import { MasterScreenerComponent } from './master-screener/index';
import { AppComponent } from './app.component';

export const routes: RouterConfig = [
  { path: 'master-screener', component: MasterScreenerComponent },
  { path: '', component: AppComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];