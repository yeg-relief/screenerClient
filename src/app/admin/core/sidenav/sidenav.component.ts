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
      title: 'master-screener',
      url: 'admin/master-screener/overview',
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
