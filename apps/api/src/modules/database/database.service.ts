import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, Property, DatabaseRow } from '@masar/db';
import { CreatePropertyDto, UpdatePropertyDto, CreateRowDto, UpdateRowDataDto } from './dto/database.dto';

@Injectable()
export class DatabaseService {
  async createProperty(dto: CreatePropertyDto): Promise<Property> {
    const property = await prisma.property.create({
      data: {
        name: dto.name,
        type: dto.type,
        options: dto.options ? (dto.options as any) : undefined,
        pageId: dto.pageId,
      },
    });

    return property;
  }

  async updateProperty(propertyId: string, dto: UpdatePropertyDto): Promise<Property> {
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      throw new NotFoundException('الخاصية غير موجودة');
    }

    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: {
        name: dto.name,
        type: dto.type,
        options: dto.options ? (dto.options as any) : undefined,
      },
    });

    return updated;
  }

  async deleteProperty(propertyId: string): Promise<{ success: boolean; message: string }> {
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      throw new NotFoundException('الخاصية غير موجودة');
    }

    await prisma.property.delete({ where: { id: propertyId } });
    return { success: true, message: 'تم حذف الخاصية بنجاح' };
  }

  async getDatabaseSchema(pageId: string): Promise<{ properties: Property[]; rows: DatabaseRow[] }> {
    const properties = await prisma.property.findMany({
      where: { pageId },
    });

    const rows = await prisma.databaseRow.findMany({
      where: { pageId },
      orderBy: { createdAt: 'asc' },
    });

    return { properties, rows };
  }

  async createRow(dto: CreateRowDto): Promise<DatabaseRow> {
    const row = await prisma.databaseRow.create({
      data: {
        pageId: dto.pageId,
        data: dto.data || {},
      },
    });

    return row;
  }

  async updateRow(rowId: string, dto: UpdateRowDataDto): Promise<DatabaseRow> {
    const row = await prisma.databaseRow.findUnique({ where: { id: rowId } });
    if (!row) {
      throw new NotFoundException('الصف غير موجود');
    }

    const updated = await prisma.databaseRow.update({
      where: { id: rowId },
      data: {
        data: dto.data,
        updatedAt: new Date(),
      },
    });

    return updated;
  }

  async deleteRow(rowId: string): Promise<{ success: boolean; message: string }> {
    const row = await prisma.databaseRow.findUnique({ where: { id: rowId } });
    if (!row) {
      throw new NotFoundException('الصف غير موجود');
    }

    await prisma.databaseRow.delete({ where: { id: rowId } });
    return { success: true, message: 'تم حذف الصف بنجاح' };
  }
}
