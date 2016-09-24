import { Component, OnInit } from '@angular/core';

interface AdminSection {
  heading: string;
  subsections: string[];
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  private content: AdminSection[] = [
    {
      heading: 'master-screener',
      subsections: [
        'overview',
        'edit',
        'select'
      ]
    },
    {
      heading: 'keys',
      subsections: [
        'overview',
        'add-key',
        'remove-key',
        'detail'
      ]
    },
    {
      heading: 'question',
      subsections: [
        'overview',
        'edit-question',
        'add-question',
        'remove-question'
      ]
    },
    {
      heading: 'program',
      subsections: [
        'overview',
        'edit-program',
        'add-program',
        'remove-program'
      ]
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
