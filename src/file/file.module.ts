import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { ExcelProvider } from './excel.provider';
import { UsersModule } from 'src/users/users.module';
import { MulterModule } from '@nestjs/platform-express';


@Module({
  imports: [
    UsersModule,
    MulterModule.register({
      dest: './uploads', 
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx)$/)) {
          return cb(new Error('Only .xlsx files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  ],
  controllers: [FileController],
  providers: [FileService, ExcelProvider],
  exports: [FileService, ExcelProvider],
})
export class FileModule {}
