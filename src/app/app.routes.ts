import { provideRouter, RouterConfig } from '@angular/router';
import { MasterScreenerComponent } from './master-screener';
import { HomeComponent } from './home';
import { FourOhFourComponent } from './404/index';


export const routes: RouterConfig = [
  { path: '', component: HomeComponent },
  { path: 'master-screener', component: MasterScreenerComponent },
  { path: '404', component: FourOhFourComponent}
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];