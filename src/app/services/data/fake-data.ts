export function fakeData():any{
  return [
    {
      key: 'expand',
      label: 'expand group 0?',
      controlType: 'checkbox',
      value: false,
      
      expandable: 
      [
        {
          key: 'firstName',
          label: 'First name',
          controlType: 'textbox',
          value: 'Bombasto',
        },
        {
          key: 'emailAddress',
          label: 'Email',
          type: 'email',
          controlType: 'textbox',
          value: '',
        },
        {
          key: 'numberChildren',
          label: "How many children under 18?",
          controlType: 'textbox',
          value: ''
        }
      ]
      
    },
    {
      key: 'dropdownQuestion',
      label: 'select an option',
      controlType: 'radio',
      value: 'optionOne',
      options: [
       'option 1',
       'option 2',
       'option 3'
      ],
      expandable: []
    }
      
     
  ] 
}