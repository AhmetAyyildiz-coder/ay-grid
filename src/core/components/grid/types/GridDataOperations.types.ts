export type ExportFormat = 'csv' | 'excel' | 'pdf';
export type ImportFormat = 'csv' | 'excel';

export interface GridExportOptions<T> {
  formats: ExportFormat[];
  fileName?: string;
  customize?: (data: T[], format: ExportFormat) => any;
  columnMapping?: Record<keyof T, string>;
  includeColumns?: (keyof T)[];
  excludeColumns?: (keyof T)[];
}

export interface GridImportOptions<T> {
  formats: ImportFormat[];
  validate?: (data: any) => boolean;
  transform?: (data: any) => T[];
  columnMapping?: Record<string, keyof T>;
  skipRows?: number;
  maxRows?: number;
}

export interface GridDataOperations<T> {
  export?: GridExportOptions<T>;
  import?: GridImportOptions<T>;
} 