import { ROUTER_DIRECTIVES } from '@angular/router';
import { 
  Component, OnInit, 
  OnDestroy, ChangeDetectionStrategy, 
  Input, Output, 
  EventEmitter 
} from '@angular/core'
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/do';
import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';



@Component({
  selector: 'ycb-dummy',
  template:`
  SOMETHING IS HERE????
  <div *ngFor="let thing of width">
    {{width.width}}
  </div>`
})
export class DummyComponent implements OnInit{
  @Input() width
  
  ngOnInit(){
    console.log('ng init in dummy ' + this.width)
  }
}


@Component({
  selector: 'ycb-navbar',
  templateUrl:'app/navbar/navbar.component.html',
  directives: [ROUTER_DIRECTIVES, MD_TOOLBAR_DIRECTIVES]
})
export class NavbarComponent implements OnInit, OnDestroy {
  clock = Observable.interval(1000);
  public mediaWidth;
  public width;
  
  constructor(
    public store: Store<AppState>
  ){
    this.mediaWidth = store.select('media')
                      .subscribe( (width:{width: string}) => {
                        console.log(width);
                        this.width = width.width;
                      })
  }
  
  ngOnInit(){
                      
  }
  
  ngOnDestroy(){
  }
}
