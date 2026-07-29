import {
  ICreatePropertyDto,
  IUpdatePropertyDto,
  ICreateRowDto,
  IUpdateRowDataDto,
  PagePropertyType,
  IDatabaseFieldOption,
} from '@masar/types';

export class CreatePropertyDto implements ICreatePropertyDto {
  name!: string;
  type!: PagePropertyType;
  options?: IDatabaseFieldOption[];
  pageId!: string;
}

export class UpdatePropertyDto implements IUpdatePropertyDto {
  name?: string;
  type?: PagePropertyType;
  options?: IDatabaseFieldOption[];
}

export class CreateRowDto implements ICreateRowDto {
  pageId!: string;
  data?: Record<string, any>;
}

export class UpdateRowDataDto implements IUpdateRowDataDto {
  data!: Record<string, any>;
}
