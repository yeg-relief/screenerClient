import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing, appRoutingProviders }  from './app.routes';
import { AppComponent } from './app.component';
import { MdCardModule } from '@angular/material';
import { MdCoreModule } from '@angular/material';
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
    MdCardModule.forRoot(),
    MdCoreModule.forRoot()
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
