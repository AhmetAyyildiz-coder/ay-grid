import { useCallback } from 'react';
import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { 
  GridDataOperations, 
  ExportFormat, 
  ImportFormat 
} from '../types/GridDataOperations.types';
import { UserOptions } from 'jspdf-autotable';
import { read } from 'xlsx';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}

export const useGridDataOperations = <T>(options?: GridDataOperations<T>) => {
  // Export işlemleri
  const exportData = useCallback(async (
    data: T[],
    format: ExportFormat,
    fileName: string = 'grid-export'
  ) => {
    let processedData = data;
    
    // Özelleştirme varsa uygula
    if (options?.export?.customize) {
      processedData = options.export.customize(data, format);
    }

    // Sütun filtreleme
    if (options?.export?.includeColumns) {
      processedData = processedData.map(item => {
        const filtered: Partial<T> = {};
        options.export!.includeColumns!.forEach(key => {
          filtered[key] = item[key];
        });
        return filtered as T;
      });
    }

    switch (format) {
      case 'csv':
        return exportToCsv(processedData, fileName);
      case 'excel':
        return exportToExcel(processedData, fileName);
      case 'pdf':
        return exportToPdf(processedData, fileName);
      default:
        throw new Error(`Desteklenmeyen format: ${format}`);
    }
  }, [options]);

  // CSV export
  const exportToCsv = useCallback((data: T[], fileName: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${fileName}.csv`);
  }, []);

  // Excel export
  const exportToExcel = useCallback((data: T[], fileName: string) => {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer = write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${fileName}.xlsx`);
  }, []);

  // PDF export
  const exportToPdf = useCallback((data: T[], fileName: string) => {
    const doc = new jsPDF();
    const columns = Object.keys(data[0] || {}).map(key => ({
      header: options?.export?.columnMapping?.[key as keyof T] || key,
      dataKey: key
    }));

    doc.autoTable({
      columns,
      body: data.map(item => Object.values(item as Record<string, any>))
    });

    doc.save(`${fileName}.pdf`);
  }, [options]);

  // Import işlemleri
  const importData = useCallback(async (
    file: File,
    format: ImportFormat
  ): Promise<T[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          let importedData: any[];

          switch (format) {
            case 'csv':
              importedData = await importFromCsv(e.target?.result as string);
              break;
            case 'excel':
              importedData = await importFromExcel(e.target?.result as ArrayBuffer);
              break;
            default:
              throw new Error(`Desteklenmeyen format: ${format}`);
          }

          // Doğrulama
          if (options?.import?.validate && !options.import.validate(importedData)) {
            throw new Error('Geçersiz veri formatı');
          }

          // Dönüştürme
          if (options?.import?.transform) {
            importedData = options.import.transform(importedData);
          }

          resolve(importedData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Dosya okuma hatası'));

      if (format === 'csv') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  }, [options]);

  // CSV import
  const importFromCsv = useCallback(async (content: string): Promise<T[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(content, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data as T[]);
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    });
  }, []);

  // Excel import
  const importFromExcel = useCallback(async (buffer: ArrayBuffer): Promise<T[]> => {
    const wb = read(buffer, { type: 'array' });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    return utils.sheet_to_json(ws);
  }, []);

  return {
    exportData,
    importData
  };
}; 

export type { ExportFormat, ImportFormat };
