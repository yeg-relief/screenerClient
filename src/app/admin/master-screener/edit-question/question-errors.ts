export type QuestionError = {
  msg: string;
  open: string[];
  label: string;
};

export type QuestionErrors = QuestionError[];


export const LABELS = {
  NO_KEY_PICKED: 'no key picked',
  NO_LABEL_PICKED: 'no label picked',
  NO_CONTROL_PICKED: 'no control picked',
  NO_TYPE_PICKED: 'no type picked',
  MAKE_QUESTION_EXPANDABLE: 'make question expandable',
  NO_OPTIONS: 'radio button with no options',
  NO_CONDITIONALS: 'an expandable question without conditional questions',
  NON_EXPANDABLE_CONDITIONALS: 'a non-expandable question can not have conditionals'
};

const MESSAGES = {
  NO_KEY_PICKED: 'Pick a key',
  NO_LABEL_PICKED: 'Write a label',
  NO_CONTROL_PICKED: 'Select a control type',
  NO_TYPE_PICKED: 'Select the type of answer you expect',
  MAKE_QUESTION_EXPANDABLE: 'Would you like to add a hidden section to the question?',
  NO_OPTIONS: 'A button question requires options',
  NO_CONDITIONALS: 'An expandable question needs conditional questions',
  NON_EXPANDABLE_CONDITIONALS: 'An unexpandable question can not have conditional questions'
};

const OPEN_CONTROLS = {
  NO_KEY_PICKED: ['key'],
  NO_LABEL_PICKED: ['label'],
  NO_CONTROL_PICKED: ['control'],
  NO_TYPE_PICKED: ['type'],
  MAKE_QUESTION_EXPANDABLE: ['expandable'],
  NO_OPTIONS: ['control'],
  NO_CONDITIONALS: ['expandable'],
  NON_EXPANDABLE_CONDITIONALS: ['expandable']
};


export const ERRORS = {
  NO_KEY_PICKED: {
    msg: MESSAGES.NO_KEY_PICKED,
    label: LABELS.NO_KEY_PICKED,
    open: OPEN_CONTROLS.NO_KEY_PICKED
  },
  NO_LABEL_PICKED: {
    msg: MESSAGES.NO_LABEL_PICKED,
    label: LABELS.NO_LABEL_PICKED,
    open: OPEN_CONTROLS.NO_LABEL_PICKED
  },
  NO_CONTROL_PICKED: {
    msg: MESSAGES.NO_CONTROL_PICKED,
    label: LABELS.NO_CONTROL_PICKED,
    open: OPEN_CONTROLS.NO_CONTROL_PICKED
  },
  NO_TYPE_PICKED: {
    msg: MESSAGES.NO_TYPE_PICKED,
    label: LABELS.NO_TYPE_PICKED,
    open: OPEN_CONTROLS.NO_TYPE_PICKED
  },
  NO_OPTIONS: {
    msg: MESSAGES.NO_OPTIONS,
    label: LABELS.NO_OPTIONS,
    open: OPEN_CONTROLS.NO_OPTIONS
  },
  NO_CONDITIONALS: {
    msg: MESSAGES.NO_CONDITIONALS,
    label: LABELS.NO_CONDITIONALS,
    open: OPEN_CONTROLS.NO_CONDITIONALS
  },
  NON_EXPANDABLE_CONDITIONALS: {
    msg: MESSAGES.NON_EXPANDABLE_CONDITIONALS,
    label: LABELS.NON_EXPANDABLE_CONDITIONALS,
    open: OPEN_CONTROLS.NON_EXPANDABLE_CONDITIONALS
  }
};
