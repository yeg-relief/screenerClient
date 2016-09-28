import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MdCardModule } from '@angular/material/card';
import { MdRadioModule } from '@angular/material/radio';
import { MdInputModule } from '@angular/material/input';
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
  ],
})
export class QuestionModule {};
