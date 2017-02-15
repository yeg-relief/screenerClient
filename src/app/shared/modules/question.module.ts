import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material'
import { QuestionComponent } from
  '../components/question/question.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule.forRoot()
  ],
  declarations: [
    QuestionComponent
  ],
  exports: [
    QuestionComponent
  ],
})
export class QuestionModule {};
