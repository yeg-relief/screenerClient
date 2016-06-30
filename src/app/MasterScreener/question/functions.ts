import * as QInterface from './interfaces';
import * as QTypes from './types';
import { FormControl, Validators, FormGroup } from '@angular/forms';

function _buildControl(question: QInterface.ControllableQuestion): FormControl{
  const concreteValidators: Array<any> = new Array<Validators>();
  question.validators.forEach( (abstractValidator) => {
    switch(abstractValidator){
      case QTypes.REQUIRED_VALIDATOR:
        concreteValidators.push(Validators.required);
        break;
    }
  });
  
  return new FormControl(question.value, Validators.compose(concreteValidators));
} 

function _buildControlGroup(group: QTypes.Question[]): QTypes.ControlMap{
  const controlMap: QTypes.ControlMap = {};
  group.map( question => {
    controlMap[question.key] = _buildControl(question);
  })
  return controlMap;  
}

// Object.assign has no support in TypeScript :(
export function assign(reciever: QTypes.ControlMap, target: QTypes.ControlMap):void{
  Object.keys(target).map( key => {
    reciever[key] = target[key];
  })
}

// create a map[key: string] => FormControl
export function controlReducer(group: QInterface.ConcreteQuestionGroup): QTypes.ControlMap{
  const controlMap: QTypes.ControlMap = {};  
  // expandable group
  if(group.conditional !== undefined){
    const conditionalControl: FormControl = _buildControl(group.conditional);
    controlMap[group.conditional.key] = conditionalControl;
    const res: QTypes.ControlMap = _buildControlGroup(group.expandable);
    assign(controlMap, res);
  // question group (non-expandable)
  } else {
    assign(controlMap, _buildControlGroup(group.group));
  }
  return controlMap;
} 

