import { 
  MasterScreener, ExpandableGroup, 
  QuestionGroup, GeneralQuestionGroup, 
  Question 
} from '../index';
import { FormGroup } from '@angular/forms';

export function toForm(masterScreener: MasterScreener): FormGroup{
  const toFormGroup:any = {};
  // partition the array of General Question groups into expandable and 'normal' or non-expandable groups
  const partition: any = masterScreener.questionGroups
        .reduce( (partition, curr: GeneralQuestionGroup) => {
          // cast the current question as each type
          const expandable: ExpandableGroup = <ExpandableGroup>curr;
          const group: QuestionGroup = <QuestionGroup>curr;
          // check if its an expandable group
          if(expandable.conditional !== undefined 
            && expandable.expandable !== undefined && group.group === undefined){
            partition.exp.push(expandable)
            // check if it's a 'normal' group 
          } else if(expandable.conditional === undefined 
            && expandable.expandable === undefined && group.group !== undefined){
              partition.cons.push(group); 
            }
          return partition;
        },{
          cons: new Array<QuestionGroup>(), //"cons"tant question groups, ie, not dependent on conditionals
          exp: new Array<ExpandableGroup>() //"exp"andable question groups
        });
  
  
  
  // register all formControls for 'constant' questions      
  partition.cons.map( (questionGroup: QuestionGroup) => {
    questionGroup.group.map( (question: Question) => {    
      toFormGroup[question.key] = masterScreener.controls[question.key];
    })
  })
  
  // only register the conditional question unless checked then register conditional + all expandable
  partition.exp.map( (expandableGroup: ExpandableGroup) => {
    toFormGroup[expandableGroup.conditional.key] = masterScreener.controls[expandableGroup.conditional.key]
    if(expandableGroup.conditional.value === true){
      expandableGroup.expandable.map( (question: Question) => {
        toFormGroup[question.key] = masterScreener.controls[question.key];
      })
    } 
  }) 
  return new FormGroup(toFormGroup);
}