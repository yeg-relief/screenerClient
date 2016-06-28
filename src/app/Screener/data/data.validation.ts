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
  
  // this is an expandable group
  if(constantQuestionGroup.group === undefined && 
    (expandableQuestionGroup.conditional !== undefined && expandableQuestionGroup.expandable !== undefined)){
    try{
      validateKey(expandableQuestionGroup.conditional)
    } catch(e){
      // if the key for the conditional is not present the whole group is malformed
      console.error(e.message);
      return
    }
    
    expandableQuestionGroup.expandable.forEach( (question: any, index: number) => {
      try{
        validateKey(question)
      } catch(e){
        // remove question with bad key
        expandableQuestionGroup.expandable.splice(index, 1);
        console.error(e.message);
      }
    })
  }
  
  // this is a 'constant group'
  if(constantQuestionGroup.group !== undefined && 
    (expandableQuestionGroup.conditional === undefined && expandableQuestionGroup.expandable === undefined)){
      
    constantQuestionGroup.group.forEach( (question: any, index: number) => {
      try{
        validateKey(question)
      } catch(e){
        // remove question with bad key
        constantQuestionGroup.group.splice(index, 1);
        console.error(e.message);
      }
    })
  }
}

function validateKey(question: any){
  if(typeof question.key !== 'string'){
    throw new Error(`${question} does not have a string key: ${question.key}`);
  }
 
  if(question.key.length === 0){
    throw new Error(`${question} has a empty string for key: ${question.key}`);
  } 
}