export function fakeData():any{
  return [
    {
    
      conditional: {
        key: 'expand',
        label: 'expand group 0?',
        controlType: 'checkbox',
        value: false,
        validators: ['REQUIRED']
      },
      expandable: 
      [
        {
          key: 'firstName',
          label: 'First name',
          controlType: 'textbox',
          value: 'Bombasto',
          validators: ['REQUIRED']
        },
        {
          key: 'emailAddress',
          label: 'Email',
          type: 'email',
          controlType: 'textbox',
          value: '',
          validators: []
        },
        {
          key: 'numberChildren',
          label: "How many children under 18?",
          controlType: 'textbox',
          validators: ['REQUIRED'],
          value: ''
        }
      ]
      
    },
    {
      group: [
        {
          key: 'dropdownQuestion',
          label: 'select an option',
          controlType: 'dropdown',
          validators: [''],
          value: 'optionOne',
          options: [
            {key: 'optionOne', value: 'option 1'},
            {key: 'optionTwo', value: 'option 2'},
            {key: 'optionThree', value: 'option 3'}
          ]
        }
      ]
    } 
  ] 
}