import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Key } from '../../../models/key';
import { ProgramCondition } from '../../../models/program';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-application-side',
  templateUrl: './application-side.component.html',
  styleUrls: ['./application-side.component.css']
})
export class ApplicationSideComponent implements OnInit {
  @Output() saveCondition = new EventEmitter<ProgramCondition>();
  @Input() keys: Key[];
  @Input() conditionsLength: number;

  keyControl = new FormControl('select a key');

  inputError = false;
  numberOptions = [
    {
      display: '>', value: 'greaterThan'
    },
    {
      display: '>=', value: 'greaterThanOrEqual'
    },
    {
      display: '=', value: 'equal'
    },
    {
      display: '<=', value: 'lessThanOrEqual'
    },
    {
      display: '<', value: 'lessThan'
    }
  ];

  numberDisplayOptions  = this.numberOptions.reduce( (accum, option) => {
    accum.push(option.display);
    return accum;
  }, []);

  numberValueOptions = this.numberOptions.reduce( (accum, option) => {
    accum.push(option.value);
    return accum;
  }, []);

  selectedNumberOption = this.numberValueOptions[0];

  booleanOptions = [
    {
      display: 'true', value: true
    },
    {
      display: 'false', value: false
    }
  ];

  booleanDisplayOptions = this.booleanOptions.reduce ( (accum, option) => {
    accum.push(option.display);
    return accum;
  }, []);

  booleanValueOptions = this.booleanOptions.reduce ( (accum, option) => {
    accum.push(option.value);
    return accum;
  }, []);


  newCondition: ProgramCondition = this.blankCondition();

  constructor() { }

  ngOnInit() {
    this.keyControl.valueChanges.subscribe(val => console.log(val));
  }

  blankCondition(): ProgramCondition {
    return {
      guid: 'empty',
      key: {
        name: 'empty',
        type: undefined
      },
      value: undefined,
      type: undefined,
      qualifier: undefined
    };
  }

  isEmpty() {
    return this.newCondition.key.name === 'empty';
  }

  keyChange(value) {
    this.newCondition = this.blankCondition();
    const key = this.keys.find(inputKey => value === inputKey.name);
    if (key !== undefined) {
      this.inputError = false;
      this.newCondition.key = key;
      this.newCondition.type = key.type;
      if (key.type === 'number') {
        this.newCondition.value = 0;
        this.newCondition.qualifier = this.numberValueOptions[0];
        this.selectedNumberOption = this.numberValueOptions[0];
      } else if (key.type === 'boolean') {
        this.newCondition.value = true;
      }
    }
  }

  keySelected(name) {
    return name === this.newCondition.key.name;
  }

  valueInput($event) {
    const reg = new RegExp('^\\d+$');
    if (reg.test($event)) {
      this.inputError = false;
      this.newCondition.value = $event;
    } else {
      this.inputError = true;
      if ($event === '') {
        this.newCondition.value = 0;
      }
    }
  }

  boolChange($event) {
    this.newCondition.value = $event;
  }

  qualifierChange($event) {
    this.newCondition.qualifier = $event;
  }

}
