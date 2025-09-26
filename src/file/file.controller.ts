import { Controller, Get, Res, UseGuards, Header, StreamableFile } from '@nestjs/common';
import { FileService } from './file.service';
import { type Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/libs/guards/roles.guard';
import { Roles } from 'src/libs/decorators/role.decorator';



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
}
