import {  QuestionGroup, ExpandableGroup, GeneralQuestionGroup } from '../question/index';


export function validateQuestionGroup(questionGroup: GeneralQuestionGroup){
  const constantQuestionGroup: QuestionGroup = <QuestionGroup>questionGroup;
  const expandableQuestionGroup: ExpandableGroup = <ExpandableGroup>questionGroup;

  if(constantQuestionGroup.group === undefined && 
      (expandableQuestionGroup.conditional === undefined || expandableQuestionGroup.expandable === undefined)){
    throw new Error(`questionGroup is malformed:\n
                     ${constantQuestionGroup.group}\n
                     ${expandableQuestionGroup.conditional}
                     ${expandableQuestionGroup.expandable}`);      
  }
  if(constantQuestionGroup.group !== undefined && 
      (expandableQuestionGroup.conditional !== undefined || expandableQuestionGroup.expandable !== undefined)){
    throw new Error(`questionGroup is malformed:\n
                     ${constantQuestionGroup.group}\n
                     ${expandableQuestionGroup.conditional}
                     ${expandableQuestionGroup.expandable}`);     
  }
}