import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-question-label',
  templateUrl: './edit-question-label.component.html',
  styleUrls: ['./edit-question-label.component.css']
})
export class EditQuestionLabelComponent implements OnInit {
  @Input() label: string;
  @Output() labelChange = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }

  changeLabel($event) {
    console.log($event);
  }
}
