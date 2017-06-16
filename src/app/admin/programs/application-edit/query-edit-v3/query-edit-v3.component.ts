import { Component, OnInit, Input } from '@angular/core';
import { ProgramConditionClass } from '../../services/program-condition.class';
import { ProgramQueryClass } from '../../services/program-query.class';
import { QueryService } from '../../services/query.service';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/filter'
import {MdSnackBar} from '@angular/material';

@Component({
  selector: 'app-query-edit-v3',
  templateUrl: './query-edit-v3.component.html',
  styleUrls: ['./query-edit-v3.component.css']
})
export class QueryEditV3Component implements OnInit {
  @Input() programQuery: ProgramQueryClass;
  constructor(private service: QueryService, public snackBar: MdSnackBar) { }

  ngOnInit() {}

  newCondition() {
    this.programQuery.addCondition();
  }

  saveQuery() {
    const networkRequest = 
      this.service.createOrUpdate(this.programQuery, this.programQuery.data.guid)
      .take(1)
      .subscribe(val => {
        if(val) {
          this.snackBar.open('query saved.', '', {
            duration: 2000
          })
          
          // update the query here...
          this.programQuery.form.setValue(this.programQuery.data);
        }
          
        else
          this.snackBar.open('error: query not saved.', '', {
            duration: 2000
          })
      })
  }
}
