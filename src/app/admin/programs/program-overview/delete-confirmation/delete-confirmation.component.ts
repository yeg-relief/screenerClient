import { Component, OnInit } from '@angular/core';
import { ApplicationFacingProgram } from '../../../models/program';
import 'rxjs/add/operator/take';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as fromOverview from '../actions';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private store: Store<fromRoot.State>, private route: ActivatedRoute) { }

  ngOnInit() {
    //this.service.program$.take(1).subscribe(serviceProgram => this.program = serviceProgram);
    const guid = this.route.snapshot.params['guid'];
    fromRoot.findProgram(this.store, guid).take(1).subscribe(p => this.program = p);
    this.deletionInProgress = false;
  }

  handleDelete() {
    this.store.dispatch(new fromOverview.DeleteProgram(this.program));
    this.deletionInProgress = true;
  }
}
