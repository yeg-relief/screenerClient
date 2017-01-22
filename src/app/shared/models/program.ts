type Tag = string;

export interface UserFacingProgram {
  guid: string;
  title: string;
  details: string;
  externalLink: string;
  created: number;
  tags: Tag[];
}
