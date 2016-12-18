import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit-question-toolbar-controls',
  templateUrl: './edit-question-toolbar-controls.component.html',
  styleUrls: ['./edit-question-toolbar-controls.component.css']
})
export class EditQuestionToolbarControlsComponent implements OnInit {
  workingEditVersion: number;
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.workingEditVersion = +this.route.snapshot.params['version'];
  }

  handleSave() {}

}
