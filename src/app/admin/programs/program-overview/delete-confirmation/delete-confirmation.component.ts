import { Component, OnInit } from '@angular/core';
import { UserFacingProgram } from '../../../../shared/models';
import { ProgramDeleteGuardService } from './route-guard';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css']
})
export class DeleteConfirmationComponent implements OnInit {
  program: UserFacingProgram = {
    guid: '',
    description: {
      guid: '',
      title: '',
      details: '',
      externalLink: ''
    },
    created: '',
    tags: []
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
