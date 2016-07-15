import { provideRouter, RouterConfig } from '@angular/router';
import { 
  MasterScreenerComponent, HomeComponent,
  FourOhFourComponent, MasterScreenerResultsComponent,
  MasterScreenerEditor
} from './pages';

export const routes: RouterConfig = [
  { path: '', component: HomeComponent },
  { path: 'master-screener', component: MasterScreenerComponent },
  { path: '404', component: FourOhFourComponent },
  { path: 'master-screener-results', component: MasterScreenerResultsComponent },
  { path: 'master-screener-editor', component: MasterScreenerEditor }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];