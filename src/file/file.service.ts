import { Injectable } from '@nestjs/common';
import { ExcelProvider } from './excel.provider';
import { UsersService } from 'src/users/users.service';
import * as ExcelJS from 'exceljs';


@Injectable()
export class FileService {

    constructor(
        private readonly excelProvider: ExcelProvider,
        private readonly usersService: UsersService,
    ) {}

    async exportUsersToExcel(): Promise<ExcelJS.Workbook> {
        const { workbook, worksheet } = this.excelProvider.createWorkbook();

        let lastId: string | undefined;

        while (true) {
            const users = await this.usersService.findPaginated(lastId, 100);
            if (users.length === 0) {
                break;
            }
            this.excelProvider.appendUsers(worksheet, users);
            lastId = users[users.length - 1]._id.toString();
        }
        
        return workbook;
    }
}
