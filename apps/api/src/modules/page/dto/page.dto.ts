import { ICreatePageDto, IUpdatePageDto } from '@masar/types';

export class CreatePageDto implements ICreatePageDto {
  title?: string;
  icon?: string;
  workspaceId!: string;
  parentId?: string;
  isDatabase?: boolean;
}

export class UpdatePageDto implements IUpdatePageDto {
  title?: string;
  icon?: string;
  coverUrl?: string;
  content?: any;
  isPublished?: boolean;
  isArchived?: boolean;
}
