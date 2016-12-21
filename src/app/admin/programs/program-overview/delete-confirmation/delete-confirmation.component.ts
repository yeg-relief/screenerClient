import { Component, OnInit } from '@angular/core';
import { ApplicationFacingProgram } from '../../../models/program';
import { ProgramDeleteGuardService } from './route-guard';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css']
})
export class DeleteConfirmationComponent implements OnInit {
  // some type of cheap hack to avoid undefined in render
  program: ApplicationFacingProgram = {
    guid: '',
    user: {
      guid: '',
      title: '',
      details: '',
      externalLink: '',
      created: 0,
      tags: []
    },
    application: []
  };
  deletionInProgress: boolean;

  constructor(private service: ProgramDeleteGuardService) { }

  ngOnInit() {
    this.service.program$.take(1).subscribe(serviceProgram => this.program = serviceProgram);
    this.deletionInProgress = false;
  }

  handleDelete() {
    this.service.dispatchDelete(this.program);
    this.deletionInProgress = true;
  }
}
