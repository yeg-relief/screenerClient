import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Key } from '../../../models/key';
import { ProgramCondition, ApplicationFacingProgram, ProgramQuery } from '../../../models/program';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-application-side',
  templateUrl: './application-side.component.html',
  styleUrls: ['./application-side.component.css']
})
export class ApplicationSideComponent {

  @Output() saveQueries = new EventEmitter<ProgramQuery[]>();
  @Input() program: FormControl;
  @Input() readonly guid: string;
  editQuery$ = new EventEmitter<ProgramQuery>();;

  deleteQuery(query) {
    this.program.setValue(this.program.value.filter(q => q.id !== query.id));
  }

  handleAddQuery() {

    this.editQuery$.emit({ 
      guid: this.guid,
      id: 'new',
      conditions: []
    });
    
    
  }

  handleSave(query) {
    const presentQueries = this.program.value;

    if(query.id === 'new') query.id = this.randomString();

    if (presentQueries.find(q => JSON.stringify(q) === JSON.stringify(query)) === undefined)
      this.program.setValue([...presentQueries, query]);

    this.editQuery$.emit(null);
  }

  handleCancel($event){
    this.editQuery$.emit(null);
  }

  private randomString() {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 20; i++) {
      let randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
  }

}