import { Component, OnInit, Input , Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-edit-question-type',
  templateUrl: './edit-question-type.component.html',
  styleUrls: ['./edit-question-type.component.css']
})
export class EditQuestionTypeComponent implements OnInit {
  @Input() type: string;
  @Output() typeChange = new EventEmitter<string>();
  private options = [
    {display: 'true/false', value: 'boolean'},
    {display: 'number', value: 'number'},
    {display: 'text', value: 'text'}
  ];

  constructor() { }

  ngOnInit() {
  }

  changeType($event) {
    console.log($event);
  }

}
