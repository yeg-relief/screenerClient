import { Component, OnInit, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-detail-modal',
  templateUrl: './detail-modal.component.html',
  styleUrls: ['./detail-modal.component.css']
})
export class DetailModalComponent implements OnInit, AfterViewInit {
  width: number;
  constructor(
    @Inject(MD_DIALOG_DATA) public data: any, 
    private elRef:ElementRef
  ) { }

  ngOnInit() {}

  ngAfterViewInit(){
    console.log(this.elRef.nativeElement.getBoundingClientRect());
    this.width = this.elRef.nativeElement.getBoundingClientRect().width;
  }

}
