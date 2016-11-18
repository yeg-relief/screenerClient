import { Component, OnInit, Input } from '@angular/core';
import { Key } from '../../models/key';

@Component({
  selector: 'app-key-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class KeyDetailComponent implements OnInit {
  @Input() key: Key;
  constructor() { }

  ngOnInit() {
  }

}
