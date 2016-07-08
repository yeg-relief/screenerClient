import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, getCurrentQuestion } from '../reducers';
import { MasterScreenerEffects } from '../effects/master-screener';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/do';

@Component({
  selector: 'master-screener',
  templateUrl:'app/master-screener/master-screener.component.html',
  styles: [''], 
  directives: [],
  providers: [MasterScreenerEffects]
})
export class MasterScreenerComponent implements OnInit {
  width$: Observable<any>
  currentQuestion$: Observable<any>

  constructor(private store: Store<AppState>) {}
  ngOnInit() {
    this.width$ = this.store.select('media')      
                  .map( (thing:any) => thing.width);
                      
    this.currentQuestion$ = this.store.let(getCurrentQuestion())
                            .do( x => console.log(x));
    
    
  }


}
