import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class WidthState implements OnDestroy{
  private widthSubject: EventEmitter<any> = new EventEmitter<any>();
  widthBehavior: BehaviorSubject<any>;

  public get subject(): EventEmitter<any> {
    return this.widthSubject;
  }
  
  public get behavior(): BehaviorSubject<any>{
    return this.widthBehavior;
  }
  
  buildBehavior(seed: number){
    this.widthBehavior = new BehaviorSubject({width: seed});
    this.widthSubject.subscribe( x => this.widthBehavior.next(x));
  }
  
  getBehavior(fn){
    return this.widthBehavior.subscribe(fn);
  }

  
  ngOnDestroy(){
    this.widthSubject.unsubscribe();
  }
}
