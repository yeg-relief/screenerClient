import { provideRouter, RouterConfig } from '@angular/router';
import { 
  MasterScreenerComponent, HomeComponent,
  FourOhFourComponent, MasterScreenerResultsComponent
} from './pages';

import { EditorRoutes } from './pages';
import { KeyEditorRoutes } from './components/editor/key-routes';

export const routes: RouterConfig = [
  { path: '', component: HomeComponent },
  { path: 'master-screener', component: MasterScreenerComponent },
  { path: '404', component: FourOhFourComponent },
  { path: 'master-screener-results', component: MasterScreenerResultsComponent },
  ...EditorRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];