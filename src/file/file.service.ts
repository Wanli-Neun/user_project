import { Injectable } from '@nestjs/common';
import { ExcelProvider } from './excel.provider';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/libs/dto/users/create-user.dto';
import { UserRole } from 'src/libs/dto/users/create-user.dto';
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

    async importUsersFromExcel(filePath: string): Promise<{ importedCount: number }> {

        const importUserDtos = await this.excelProvider.parseUsers(filePath);
        let importedCount = 0;

        for (const userDto of importUserDtos) {
            const createUserDto: CreateUserDto = {
                ...userDto,
                password: 'AnhEm6789',
                role: UserRole.User,
            };
            const user = await this.usersService.create(createUserDto);
            if (user) {
                importedCount++;
            }
        }

        return { importedCount };
    }
}
