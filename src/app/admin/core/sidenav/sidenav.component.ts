import { Component, OnInit } from '@angular/core';

interface Section {
  title: string;
  url: string;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  private content: Section[] = [
    {
      title: 'screener',
      url: 'screener/edit',
    },
    {
      title: 'programs',
      url: 'admin/programs/overview',
    },
    {
      title: 'keys',
      url: 'admin/keys/overview'
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
