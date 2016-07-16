import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import 'rxjs/add/operator/map';
import { MD_GRID_LIST_DIRECTIVES } from '@angular2-material/grid-list';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';

@Component({
  templateUrl: 'app/pages/home/home.component.html',
  styleUrls: ['app/pages/home/home.component.css'],
  directives: [ROUTER_DIRECTIVES, MD_GRID_LIST_DIRECTIVES, MD_BUTTON_DIRECTIVES, MD_CARD_DIRECTIVES]
})
export class HomeComponent implements OnInit {

  public mediaWidth;
  
  constructor(public store: Store<AppState>){}
  
  ngOnInit(){
    this.mediaWidth = this.store.select('media')      
                      .map( (thing:any) => thing.width)         
  }
  
  ngOnDestroy(){
    this.mediaWidth.unsubscribe();
  }

}
