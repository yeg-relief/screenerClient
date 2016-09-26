import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MdCardModule } from '@angular2-material/card';
import { MdRadioModule } from '@angular2-material/radio';
import { MdInputModule } from '@angular2-material/input';
import { QuestionComponent } from
  '../components/question/question.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MdCardModule.forRoot(),
    MdRadioModule.forRoot(),
    MdInputModule.forRoot()
  ],
  declarations: [
    QuestionComponent
  ],
  exports: [
    QuestionComponent
  ]
})
export class QuestionModule {};
