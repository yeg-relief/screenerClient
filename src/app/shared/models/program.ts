interface ProgramDescription {
  guid: string;
  title: string;
  details: string;
  externalLink: string;
}

type Tag = string;

export interface UserFacingProgram {
  guid: string;
  description: ProgramDescription;
  tags: Tag[];
}
