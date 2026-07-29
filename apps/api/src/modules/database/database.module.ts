import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { FormsController } from './forms.controller';

@Module({
  controllers: [DatabaseController, FormsController],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
