import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms'

@Component({
  selector: 'app-tag-edit',
  templateUrl: './tag-edit.component.html',
  styleUrls: ['./tag-edit.component.css']
})
export class TagEditComponent implements OnInit {
  @Input() tags: FormArray;
  tagInput = new FormControl('', Validators.pattern('[a-zA-Z0-9]{2,8}'))
  constructor() { }

  ngOnInit() {
    this.tagInput.valueChanges.subscribe(x => console.log(x))
  }

  addTag() {
    if (this.tagInput.valid && this.tagInput.value.trim().length > 0 ) {
      this.tags.push(new FormControl(this.tagInput.value));
      this.tagInput.setValue('');
    }
  }

  removeTagAt(index: number){
    this.tags.removeAt(index);
  }
}
