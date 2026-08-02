// Masar SaaS Shared Interfaces & DTOs

export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
}

export enum PagePropertyType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  SELECT = 'SELECT',
  MULTI_SELECT = 'MULTI_SELECT',
  DATE = 'DATE',
  PERSON = 'PERSON',
  FILES = 'FILES',
  CHECKBOX = 'CHECKBOX',
  URL = 'URL',
  EMAIL = 'EMAIL',
  FORMULA = 'FORMULA',
  RELATION = 'RELATION',
  ROLLUP = 'ROLLUP',
}

export type PageType = 'DOCUMENT' | 'DATABASE';

export interface IUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkspace {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILayoutState {
  sidebarOpen: boolean;
  sidebarWidth: number;
}

export interface IMember {
  id: string;
  role: UserRole;
  userId: string;
  workspaceId: string;
  user?: IUser;
  createdAt: Date;
}

export interface IPage {
  id: string;
  title: string;
  icon?: string | null;
  coverUrl?: string | null;
  content?: any;
  isPublished: boolean;
  isArchived: boolean;
  isDatabase: boolean;
  type?: PageType;
  position?: number;
  isFavorite?: boolean;
  fullWidth?: boolean;
  fontStyle?: string;
  smallText?: boolean;
  isLocked?: boolean;
  workspaceId: string;
  authorId: string;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Module 01: Authentication DTOs
export interface IRegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export interface IJwtPayload {
  sub: string;
  email: string;
}

// Module 03: Workspace & Member DTOs
export interface ICreateWorkspaceDto {
  name: string;
  slug?: string;
  icon?: string;
}

export interface IUpdateWorkspaceDto {
  name?: string;
  icon?: string;
}

export interface IAddMemberDto {
  email: string;
  role?: UserRole;
}

export interface IUpdateMemberRoleDto {
  role: UserRole;
}

// Module 04: TipTap Arabic Editor Types
export interface ISlashMenuItem {
  title: string;
  description: string;
  iconName: string;
  command: (editor: any) => void;
}

// Module 05: Realtime Collaboration & Yjs Types
export interface IUserAwareness {
  id: string;
  name: string;
  color: string;
  avatarUrl?: string;
}

export interface ISyncUpdatePayload {
  documentId: string;
  update: string;
  user?: IUserAwareness;
}

// Module 06: Page Tree & Nested Documents DTOs
export interface ICreatePageDto {
  title?: string;
  icon?: string;
  workspaceId: string;
  parentId?: string;
  isDatabase?: boolean;
  type?: PageType;
}

export interface IUpdatePageDto {
  title?: string;
  icon?: string;
  coverUrl?: string;
  content?: any;
  isPublished?: boolean;
  isArchived?: boolean;
  type?: PageType;
  isFavorite?: boolean;
  fullWidth?: boolean;
  fontStyle?: string;
  smallText?: boolean;
  isLocked?: boolean;
  parentId?: string | null;
  position?: number;
}

export interface IPageTreeNode extends IPage {
  children: IPageTreeNode[];
}

// Module 07: Database Schema Engine DTOs & Types
export interface IDatabaseFieldOption {
  id: string;
  name: string;
  color: string;
}

export interface IProperty {
  id: string;
  name: string;
  type: PagePropertyType;
  options?: IDatabaseFieldOption[] | any;
  pageId: string;
}

export interface IDatabaseRow {
  id: string;
  pageId: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatePropertyDto {
  name: string;
  type: PagePropertyType;
  options?: IDatabaseFieldOption[] | any;
  pageId: string;
}

export interface IUpdatePropertyDto {
  name?: string;
  type?: PagePropertyType;
  options?: IDatabaseFieldOption[] | any;
}

export interface ICreateRowDto {
  pageId: string;
  data?: Record<string, any>;
}

export interface IUpdateRowDataDto {
  data: Record<string, any>;
}
