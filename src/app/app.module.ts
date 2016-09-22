import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { routing,
         appRoutingProviders }  from './app.routes';

import { AppComponent } from './app.component';
import { MdToolbarModule } from '@angular2-material/toolbar';
import { MdCoreModule } from '@angular2-material/core';
import { MdCardModule } from '@angular2-material/card';
import { MdButtonModule } from '@angular2-material/button';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { MdRadioModule } from '@angular2-material/radio';
import { MdInputModule } from '@angular2-material/input';


import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { HomeContentComponent } from './home/home-content/home-content.component';
import { MasterScreenerComponent } from './master-screener/master-screener/master-screener.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { QuestionComponent } from './shared/components/question/question.component';
import { UserFacingProgramComponent } from './shared/components/program/user-facing-program/user-facing-program.component';
import { ResultsComponent } from './master-screener/results/results.component';
import { QuestionsComponent } from './master-screener/questions/questions.component';
import { BrowseComponent } from './browse/browse.component';
import { CategoryComponent } from './browse/category/category.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    HomeContentComponent,
    MasterScreenerComponent,
    PageNotFoundComponent,
    QuestionComponent,
    UserFacingProgramComponent,
    ResultsComponent,
    QuestionsComponent,
    BrowseComponent,
    CategoryComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    routing,
    MdToolbarModule.forRoot(),
    MdCoreModule.forRoot(),
    MdButtonModule.forRoot(),
    MdCardModule.forRoot(),
    MdCheckboxModule.forRoot(),
    MdRadioModule.forRoot(),
    MdInputModule.forRoot()
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
