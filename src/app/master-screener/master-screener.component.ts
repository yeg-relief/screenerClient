import { Component, OnInit } from '@angular/core';
import { DataService, MasterScreener, ExpandableGroup, QuestionGroup  } from '../Screener/index';
import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormControl } from '@angular/forms';
import { toForm, expandableControlMap } from '../Screener/index';
import { GeneralQuestionGroupComponent } from '../question-group/index';

@Component({
  selector: 'master-screener',
  template:` 
  <div class="mt3">
    <form (ngSubmit)="onSubmit()" 
     [formGroup]="form" 
     [id]="masterScreenerForm" 
     class="mt3">
     
      <div *ngFor="let questionGroup of data.questionGroups">
        <general-question-group 
          [form]="form" 
          [questionGroup]="questionGroup"
          [collapsedControlMap]="collapsedControlMap">
        </general-question-group>
      </div>
      <!-- flex padding -->
      <div class="md-show">
        <button type="submit" 
          [id]="masterScreenerSubmit" 
          class="btn btn-primary border">
            Save
        </button>
      </div>
      
    </form>
    <div *ngIf="payload">
      <strong>Saved the following values</strong><br>{{payload}}
    </div>
    
    
  </div>`,
  styles: [''], 
  directives: [REACTIVE_FORM_DIRECTIVES, GeneralQuestionGroupComponent],
  providers:  [DataService]
})
export class MasterScreenerComponent implements OnInit {
  private data: MasterScreener;
  private form: FormGroup;
  private payload: string = '';
  private collapsedControlMap: { [key:string]:{key:string, control:FormControl}[]};


  constructor(private dataService: DataService) {}
  ngOnInit() {
    this.dataService.getMasterScreener()
        .subscribe( 
          (data) => {this.data = data},
          (error) => {console.log(error)},
          () => {
            this.form = toForm(this.data);
            this.collapsedControlMap = expandableControlMap(this.data);

          }
        )
  }

  private onSubmit() {
    this.payload = JSON.stringify(this.form.value);
  }
}
