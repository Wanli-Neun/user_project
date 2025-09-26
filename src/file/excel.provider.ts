import * as ExcelJS from 'exceljs';
import { Injectable } from '@nestjs/common';

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
}
