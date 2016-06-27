export function fakeData():any{
  return [
    {
    
      conditional: {
        key: 'expand',
        label: 'expand group 0?',
        controlType: 'checkbox',
        value: true,
        validators: ['REQUIRED'],
        conditional: 'true'
      },
      expandable: 
      [
        {
          key: 'firstName',
          label: 'First name',
          controlType: 'textbox',
          value: 'Bombasto',
          validators: ['REQUIRED'],
          order: 2
        },
        {
          key: 'emailAddress',
          label: 'Email',
          type: 'email',
          controlType: 'textbox',
          value: '',
          validators: [],
          order: 3
        },
        {
          key: 'numberChildren',
          label: "How many children under 18?",
          controlType: 'textbox',
          validators: ['REQUIRED'],
          value: '',
          order: 4
        }
      ]
      
    } 
  ] 
}