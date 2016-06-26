import { Component, OnInit } from '@angular/core';
import { DataService, MasterScreener, ExpandableGroup, QuestionGroup  } from '../Screener/index';
import { FormGroup, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { toForm } from '../Screener/form/index';

@Component({
  selector: 'master-screener',
  template:` 
  <div>
    <form (ngSubmit)="onSubmit()" [formGroup]="form">
      <div *ngFor="let question of data.questionGroups" class="form-row">
        a group is present
      </div>
      <div class="form-row">
        <button type="submit" [disabled]="!form.valid">Save</button>
      </div>
      
    </form>
    <div *ngIf="payload" class="form-row">
      <strong>Saved the following values</strong><br>{{payload}}
    </div>
  </div>`,
  styles: [''], 
  directives: [REACTIVE_FORM_DIRECTIVES],
  providers:  [DataService]
})
export class MasterScreenerComponent implements OnInit {
  private data: MasterScreener;
  private form: FormGroup;
  private payload: string = '';

  constructor(private dataService: DataService) {}
  ngOnInit() {
    this.dataService.getMasterScreener()
        .subscribe( 
          (data) => {this.data = data},
          (error) => {console.log(error)},
          () => {this.form = toForm(this.data)}
        )
  }

  private onSubmit() {
    this.payload = JSON.stringify(this.form.value);
  }
}
