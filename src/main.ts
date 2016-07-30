import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent, environment } from './app/';
import { HTTP_PROVIDERS } from '@angular/http';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { APP_ROUTER_PROVIDERS } from './app/app.routes';
import { provideStore } from '@ngrx/store';
import { runEffects } from '@ngrx/effects';
import { MasterScreenerEffects } from './app/effects/master-screener';
import { MasterScreenerEditEffects } from './app/effects/master-screener-edit';
import { KeyEffects } from './app/effects/keys'
import { EditorService, KeyService, DataService } from './app/services/index';

import actions from './app/actions/index'
import reducer  from './app/reducers'

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent, [
  HTTP_PROVIDERS,
  disableDeprecatedForms(),
  provideForms(),
  APP_ROUTER_PROVIDERS,
  provideStore(reducer),
  actions,
  runEffects(MasterScreenerEffects, MasterScreenerEditEffects, KeyEffects),
  DataService,
  EditorService,
  KeyService
])
.catch((err: any) => console.error(err));
