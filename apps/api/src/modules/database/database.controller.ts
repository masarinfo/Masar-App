import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DatabaseService } from './database.service';
import { CreatePropertyDto, UpdatePropertyDto, CreateRowDto, UpdateRowDataDto } from './dto/database.dto';
import { Property, DatabaseRow } from '@masar/db';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Post('properties')
  async createProperty(@Body() dto: CreatePropertyDto): Promise<Property> {
    return this.databaseService.createProperty(dto);
  }

  @Patch('properties/:id')
  async updateProperty(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyDto,
  ): Promise<Property> {
    return this.databaseService.updateProperty(id, dto);
  }

  @Delete('properties/:id')
  async deleteProperty(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    return this.databaseService.deleteProperty(id);
  }

  @Get('pages/:pageId')
  async getDatabaseSchema(
    @Param('pageId') pageId: string,
  ): Promise<{ properties: Property[]; rows: DatabaseRow[] }> {
    return this.databaseService.getDatabaseSchema(pageId);
  }

  @Post('rows')
  async createRow(@Body() dto: CreateRowDto): Promise<DatabaseRow> {
    return this.databaseService.createRow(dto);
  }

  @Patch('rows/:id')
  async updateRow(
    @Param('id') id: string,
    @Body() dto: UpdateRowDataDto,
  ): Promise<DatabaseRow> {
    return this.databaseService.updateRow(id, dto);
  }

  @Delete('rows/:id')
  async deleteRow(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    return this.databaseService.deleteRow(id);
  }
}
