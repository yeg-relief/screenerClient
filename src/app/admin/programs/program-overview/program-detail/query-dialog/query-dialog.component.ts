import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { ProgramQuery, ApplicationFacingProgram } from '../../../../models/program';
import { Router, ActivatedRoute } from '@angular/router';
import { deepCopyQueries } from '../../helpers'
import { Observable } from 'rxjs/Observable';
import { QueryEditService } from '../../services/query-edit.service';

@Component({
  selector: 'app-query-dialog',
  templateUrl: './query-dialog.component.html',
  styleUrls: ['./query-dialog.component.css'],
  providers: [ QueryEditService ]
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryDialogComponent implements OnInit, OnDestroy {
  queries: Observable<ProgramQuery[]>;
  program: ApplicationFacingProgram;
  queryState: Observable<string>;
  templateID: Observable<string>;
  editQuery: Observable<ProgramQuery>;
  blankQuery: Observable<ProgramQuery>;
  selected: Observable<string>;
  valid = new EventEmitter<boolean>(true);

  constructor(
    public dialogRef: MdDialogRef<QueryDialogComponent>,
    private router: Router,
    private route: ActivatedRoute,
    private queryService: QueryEditService
  ) { }

  ngOnInit() {
    this.program = {...this.dialogRef._containerInstance.dialogConfig.data};
    this.queryService.queries.next(this.program.application.map(p => Object.assign({}, p)))

    this.queryState = this.queryService.watchUrlForState().debounceTime(50).map(update => update.mode);

    this.queries = this.queryService.watchUrlForState().debounceTime(50).map(update => update.queries)

    this.editQuery = this.queryService.getEditQuery();

    this.selected = this.editQuery.map(q => q.id);

    this.templateID = this.route.queryParams.filter(params => params.queryState === 'template').map(params => params.templateID);

    this.blankQuery = this.queryService.getBlankQuery(this.program.guid);
  }

  ngOnDestroy(){

  }

  handleEdit(queryID){
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        queryState: 'edit',
        queryID: queryID
      }
    })
  }

  handleDelete(queryID){
    this.router.navigate([],  {
      queryParams: {
        queryState: 'delete',
        queryID: queryID
      }
    })
  }

  clearState(){
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        queryState: ''
      }
    });
  }

  newQuery(template=false) {
    if (!template) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          queryState: 'new'
        }
      })
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          queryState: 'template',
          templateID: 'test'
        }
      })
    }
  }

  updateQuery($event: ProgramQuery) {
    this.queryService.setById($event.id, $event);
    
  }

  handleCancel(){
    this.router.navigate([], {
      queryParams: {}
    })
    .then(() => this.dialogRef.close())
    .then(() => this.dialogRef._containerInstance.dialogConfig.data = undefined);
  }

  handleSave(){

    this.router.navigate([], {
      queryParams: {}
    })
    .then(() => this.dialogRef._containerInstance.dialogConfig.data = this.queryService.getQueries())
    .then(() => this.dialogRef.close());
  }

  trackByFn(item: ProgramQuery){
    return item.id;
  }
}
