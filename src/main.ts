import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent, environment } from './app/';
import { HTTP_PROVIDERS } from '@angular/http';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { APP_ROUTER_PROVIDERS } from './app/app.routes';
import { provideStore } from '@ngrx/store';
import { runEffects } from '@ngrx/effects';
import { 
  MasterScreenerEffects, MasterScreenerEditEffects,
  ProgramEffects, AddProgramEffects, KeyEffects  }
from './app/effects/index';
import { 
  EditorService, KeyService, 
  DataService, ProgramService } 
from './app/services/index';
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
  runEffects(MasterScreenerEffects, 
             MasterScreenerEditEffects, 
             KeyEffects, 
             ProgramEffects, 
             AddProgramEffects),
  DataService,
  EditorService,
  KeyService,
  ProgramService
])
.catch((err: any) => console.error(err));
