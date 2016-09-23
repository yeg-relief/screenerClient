import { Component, OnInit, Input } from '@angular/core';

interface AdminSection {
  heading: string;
  subsections: string[];
}

@Component({
  selector: 'app-sidenav-section',
  templateUrl: './sidenav-section.component.html',
  styleUrls: ['./sidenav-section.component.css']
})
export class SidenavSectionComponent implements OnInit {
  @Input() section: AdminSection;
  expanded = false;
  constructor() { }

  ngOnInit() {
  }

  expand() {
    console.log('expand clicked');
    this.expanded = !this.expanded;
    console.log(this.expanded);
  }
}
