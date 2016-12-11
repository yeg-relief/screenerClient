import { Component, OnInit } from '@angular/core';
import { UserFacingProgram } from '../../../shared';
import { DataSharingService } from '../../../data-sharing.service';


@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  errorMessage = '';
  results = [];
  constructor(
    private dataSharingService: DataSharingService
  ) { }

  ngOnInit() {
    // this is more-or-less a hack.... boo hooo
    try {
      this.results = [].concat(this.dataSharingService.data.get('results'));
      console.log(this.results);
    } catch(error) {
      console.error('unable to get data from data-sharing-service');
    }
    
  }

}
