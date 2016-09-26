import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing, appRoutingProviders }  from './app.routes';

import { AppComponent } from './app.component';
import { MdCoreModule } from '@angular2-material/core';
import { MdCardModule } from '@angular2-material/card';

import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    routing,
    MdCoreModule.forRoot(),
    MdCardModule.forRoot()
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
