import{ 
  Directive, ElementRef, 
  Input, Renderer, OnDestroy,
  Output, EventEmitter, OnInit 
} from '@angular/core';
import {ObservableWrapper} from '@angular/core/src/facade/async';

@Directive({ 
  selector: '[forWidth]'
})
export class ForWidth implements OnDestroy{ 
  globalResize: Function;
  @Output() windowResize: EventEmitter<any> = new EventEmitter<any>(); 

  
  constructor(private el: ElementRef, private renderer: Renderer){}
  
  ngOnInit(){
    this.globalResize = this.renderer
                        .listenGlobal(
                           'window', 
                           'resize', 
                           this.otherFunc(this.windowResize));

  }
  
  otherFunc(windowResize: EventEmitter<any>){
    const val = {num: 2};
    return () => {
      console.log(val)
      console.log(windowResize);
      console.log(JSON.stringify(val));
      this.windowResize.emit(['hit']);
    }
    
  }
  
  ngOnDestroy(){
    this.globalResize();
  }
}