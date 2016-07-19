import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'ms-preview-tab',
  template: '<h1>preview tab</h1>'
})
export class MsPreviewTab implements OnInit{
  questions$: Observable<any>
  
  constructor(private store: Store<AppState>){}
  
  ngOnInit(){
    this.questions$ = this.store.select('masterScreenerEdit')
                      .map( (msEdit:any) => msEdit.data.questions)
  }
  
}