import { Component, OnInit } from '@angular/core';
import { ProgramModelService } from '../services/program-model.service'
import { Program } from '../services/program.class';
import { ProgramQueryClass } from '../services/program-query.class';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms'
import { ApplicationFacingProgram } from '../../models/program';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/multicast';

@Component({
  selector: 'app-application-edit',
  templateUrl: './application-edit.component.html',
  styleUrls: ['./application-edit.component.css']
})
export class ApplicationEditComponent implements OnInit {
  program: Observable<Program>;
  data: ApplicationFacingProgram;
  form: Observable<FormGroup>;
  selected: ProgramQueryClass;

  constructor(
    private modelService: ProgramModelService, 
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.program = this.modelService
      .findProgram(this.route.snapshot.params['guid'])
      .multicast(new ReplaySubject<Program>(1)).refCount();

    this.form = this.program.map(p => p.form).multicast(new ReplaySubject<FormGroup>(1)).refCount();

  }

  selectQuery(query: ProgramQueryClass) {
    this.selected = query;
  }

  no_op(){}

}
