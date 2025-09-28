import * as ExcelJS from 'exceljs';
import { Injectable } from '@nestjs/common';
import { IMPORT_USER_ALLOWED_HEADERS, ImportUserDto } from '../libs/dto/users/import-user.dto';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

@Injectable()
export class ExcelProvider {
  createWorkbook(): { workbook: ExcelJS.Workbook, worksheet: ExcelJS.Worksheet } {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    worksheet.columns = [
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Role', key: 'role', width: 30 },
    ];

    return {workbook, worksheet};
  }

  appendUsers(worksheet: ExcelJS.Worksheet, users: any[]): void {
    users.forEach(user => {
      worksheet.addRow({
        email: user.email,
        name: user.name,
        role: user.role,
      });
    });
  }

  async parseUsers(filePath: string): Promise<ImportUserDto[]> {

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.worksheets[0];
    const rows: ImportUserDto[] = [];

    const headerRow = worksheet.getRow(1);
    if (!headerRow || !headerRow.values) {
      throw new Error('Excel file missing header row');
    }

    const headers = (headerRow.values as any[])
      .slice(1)
      .map((v: any) => String(v).trim().toLowerCase());

    const allowedHeaders = IMPORT_USER_ALLOWED_HEADERS;
    const isValidHeader =
      headers.length === allowedHeaders.length &&
      headers.every((h, i) => h === allowedHeaders[i]);

    if (!isValidHeader) {
      throw new Error(
        `Invalid header. Expected: ${allowedHeaders.join(', ')}. Got: ${headers.join(', ')}`
      );
    }

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const raw = {
        email: row.getCell(1).text,
        name: row.getCell(2).text,
      };

      const importUserDto = plainToInstance(ImportUserDto, raw, {
        enableImplicitConversion: true,
      });


      const errors = validateSync(importUserDto, { whitelist: true });
      if (errors.length) {
        throw new Error(
          `Row ${rowNumber} validation failed: ${JSON.stringify(errors)}`
        );
      }

      rows.push(importUserDto);
    });

    return rows;
  }
}
