import { Injectable, EventEmitter, OnDestroy } from '@angular/core';

@Injectable()
export class WidthState implements OnDestroy{
  private widthSubject: EventEmitter<any> = new EventEmitter<any>();
  constructor(){
    this.widthSubject.subscribe(this.test);
  }
  
  subscribe(fn){
    return this.widthSubject.subscribe(fn);
  }
  
  
  public get subject() : EventEmitter<any> {
    return this.widthSubject;
  }
  
  
  test(event){
    console.log(`in service: ${event.width} ${event.message}`)
  }
  
  ngOnDestroy(){
    this.widthSubject.unsubscribe();
  }
}
