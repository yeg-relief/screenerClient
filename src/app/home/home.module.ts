import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { routing } from './home.routes';
import { HomeContentComponent } from './home-content/home-content.component';

@NgModule({
  imports: [
    CommonModule,
    routing
  ],
  declarations: [
    HomeComponent,
    HomeContentComponent
  ]
})
export class HomeModule { }
