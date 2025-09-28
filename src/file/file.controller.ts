import { Controller, Get, Res, UseGuards, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileService } from './file.service';
import { type Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/libs/guards/roles.guard';
import { Roles } from 'src/libs/decorators/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';



@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
@Controller('file')
export class FileController {

    constructor(private readonly fileService: FileService) {}

    @Get('export-users')
    async exportUsersToExcel(@Res() res: Response): Promise<void> {
        const workbook = await this.fileService.exportUsersToExcel();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="users.xlsx"');

        await workbook.xlsx.write(res);

        res.end();
    }

    @UseInterceptors(FileInterceptor('file'))
    @Post('import-users')
    async importUserFromExcel(@UploadedFile() file: Express.Multer.File ){
        if (!file) throw new BadRequestException('No file uploaded');

        const result = await this.fileService.importUsersFromExcel(file.path);

        return {
            message: `Imported ${result.importedCount} users successfully`,
        };
    }

}
