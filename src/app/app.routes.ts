import { provideRouter, RouterConfig } from '@angular/router';
import { MasterScreenerComponent } from './master-screener';
import { HomeComponent } from './home';
import { FourOhFourComponent } from './404/index';
import { MasterScreenerResultsComponent } from './master-screener-results';

export const routes: RouterConfig = [
  { path: '', component: HomeComponent },
  { path: 'master-screener', component: MasterScreenerComponent },
  { path: '404', component: FourOhFourComponent},
  { path: 'master-screener-results', component: MasterScreenerResultsComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];