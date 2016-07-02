import { Component, OnInit } from '@angular/core';
import { MasterScreenerComponent } from '../master-screener';
import { HomeComponent } from '../home';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { WidthState } from '../app.responsive.service';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'ycb-nav',
  template:'content?????',
  styleUrls: [],
  directives: [MasterScreenerComponent, HomeComponent, ROUTER_DIRECTIVES],
  providers: [WidthState]
})
export class NavbarComponent implements OnInit{
  
  constructor(private widthState: WidthState){
    console.log('constructed')
  }
  
  ngOnInit(){
    console.log(this.widthState)
    this.widthState.subject.asObservable().subscribe( val => console.log(`in navbar: ${val}`))
  }
}