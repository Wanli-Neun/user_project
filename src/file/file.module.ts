import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { ExcelProvider } from './excel.provider';
import { UsersModule } from 'src/users/users.module';


@Module({
  imports: [UsersModule],
  controllers: [FileController],
  providers: [FileService, ExcelProvider],
  exports: [FileService, ExcelProvider],
})
export class FileModule {}
