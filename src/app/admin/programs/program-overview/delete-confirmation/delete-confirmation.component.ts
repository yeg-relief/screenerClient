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
  program: ApplicationFacingProgram = {
    guid: '',
    user: {
      guid: '',
      description: {
        guid: '',
        title: '',
        details: '',
        externalLink: ''
      },
      created: '',
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
