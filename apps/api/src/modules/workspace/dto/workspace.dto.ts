import { ICreateWorkspaceDto, IUpdateWorkspaceDto, IAddMemberDto, UserRole } from '@masar/types';

export class CreateWorkspaceDto implements ICreateWorkspaceDto {
  name!: string;
  slug?: string;
  icon?: string;
}

export class UpdateWorkspaceDto implements IUpdateWorkspaceDto {
  name?: string;
  icon?: string;
}

export class AddMemberDto implements IAddMemberDto {
  email!: string;
  role?: UserRole;
}
