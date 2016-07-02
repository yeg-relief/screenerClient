import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WidthState implements OnDestroy{
  private widthSubject: EventEmitter<any> = new EventEmitter<any>();
  constructor(){
    this.widthSubject.subscribe(this.test);
  }
  
  subscribe(fn): Observable<any>{
    return this.widthSubject.asObservable()
  }
  
  
  public get subject(): EventEmitter<any> {
    return this.widthSubject;
  }
  
  
  test(event){
    //console.log(`in service: ${event.width} ${event.message}`)
  }
  
  ngOnDestroy(){
    this.widthSubject.unsubscribe();
  }
}
