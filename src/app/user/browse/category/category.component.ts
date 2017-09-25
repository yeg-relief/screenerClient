import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { UserFacingProgram } from '../../../shared';
import { ActivatedRoute  } from '@angular/router';
import { BrowseService } from '../browse.service';
import { Animations } from '../../../shared/animations';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  animations: [
    Animations.fadeinAndOut
  ]
})
export class CategoryComponent implements OnInit{
  ngOnInit(){}
}
