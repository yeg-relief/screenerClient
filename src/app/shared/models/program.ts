interface ProgramDescription {
  guid: string;
  title: string;
  details: string;
  externalLink: string;
}

export interface UserFacingProgram {
  guid: string;
  description: ProgramDescription;
}
