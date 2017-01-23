import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-screener-question',
  templateUrl: './screener-question.component.html',
  styleUrls: ['./screener-question.component.css']
})
export class ScreenerQuestionComponent implements OnInit {
  @Input() question;
  view: 'application' | 'user' = 'user';
  constructor() { }

  ngOnInit() {
  }

}
