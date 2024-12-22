/**
 * Grid bileşeni için prop tipleri
 */

import { GridVirtualScrollConfig } from "../types/GridDataManager.types";



/**
 * GridProps: Grid bileşeninin alacağı prop'ların tip tanımlaması
 * 
 * @prop columns - Tabloda gösterilecek sütunların tanımları
 *                 Her sütun için id, label, type gibi özellikler içerir
 * 
 * @prop data - Tabloda gösterilecek veri dizisi
 *              Her satır için benzersiz id içermeli
 * 
 * @prop loading - Verinin yüklenme durumu
 *                 true iken yükleniyor animasyonu gösterilir
 * 
 * @prop onRowClick - Satıra tıklandığında çalışacak fonksiyon
 *                    Parametre olarak tıklanan satırın verisini alır
 * 
 * @prop onCellEdit - Hücre düzenleme işlemi için kullanılan fonksiyon
 *                    Parametre olarak satır id'si, sütun id'si ve yeni değeri alır
 *                    Promise döner, işlem başarılı ise true, değilse false döner
 * 
 * @prop showGrouping - Gruplama özelliğinin aktif olup olmadığı
 *                      true ise gruplama seçenekleri gösterilir
 * 
 * @prop showExport - Dışa aktarma özelliğinin aktif olup olmadığı
 *                    true ise dışa aktarma butonu gösterilir
 * 
 * @prop virtualScrollConfig - Sanal kaydırma özelliğinin ayarları
 * 
 * Örnek Kullanım:
 * interface MyGridProps extends GridProps {
 *   customProp?: string;
 * }
 */
export interface GridProps {
  title?: string;
  columns: GridColumn[];
  data: GridRow[];
  loading?: boolean;
  keyField: string;
  onRowClick?: (row: GridRow) => void;
  onCellEdit?: (rowId: string | number, field: string, value: any) => Promise<boolean>;
  showGrouping?: boolean;
  showExport?: boolean;
  virtualScrollConfig?: GridVirtualScrollConfig;
  apiUrl?: string;
}




/**
 * Grid bileşeni için temel tip tanımlamaları
 */

/**
 * GridColumn: Tablo sütunlarının özelliklerini tanımlar
 * @property id - Sütunun benzersiz kimliği
 * @property label - Sütun başlığında görünecek metin
 * @property type - Sütundaki verinin tipi (metin, sayı, tarih, boolean)
 * @property filterable - Sütunun filtrelenebilir olup olmadığı
 * @property sortable - Sütunun sıralanabilir olup olmadığı
 * @property groupable - Sütunun gruplanabilir olup olmadığı
 * @property width - Sütun genişliği (piksel)
 * @property align - Sütun içeriğinin hizalaması
 * @property format - Sütun değerini formatlamak i��in kullanılacak fonksiyon
 */
export type GridColumnType = 'text' | 'number' | 'date' | 'boolean';

export interface GridColumn {
  id: string;
  label: string;
  type?: GridColumnType;
  filterable?: boolean;
  sortable?: boolean;
  groupable?: boolean;
  format?: (value: any) => string;
  width?: number;
}

/**
 * GridRow: Tablo satırlarının yapısını tanımlar
 * @property id - Satırın benzersiz kimliği
 * @property [key: string] - Dinamik olarak eklenebilecek diğer özellikler
 */
export interface GridRow {
  id: string | number;
  [key: string]: any;
}

/**
 * GridState: Grid'in durumunu yöneten ana interface
 * @property page - Aktif sayfa numarası
 * @property pageSize - Sayfa başına gösterilecek satır sayısı
 * @property sortModel - Sıralama ayarları
 * @property filterModel - Filtreleme ayarları
 * @property selectedRows - Seçili satırların id'leri
 * @property groupBy - Gruplama yapılacak sütun id'si
 */
export interface GridState {
  page: number;
  rowsPerPage: number;
  selectedRows: (string | number)[];
  searchValues: Record<string, string>;
  filterValues: Record<string, any[]>;
  sortConfig: GridSortConfig;
  visibleColumns: string[];
  groupBy: string | null;
}

export interface GridFilterData {
  [key: string]: any[];
}

export type SortDirection = 'asc' | 'desc';

export interface GridSortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface GridGroup {
  value: string;
  count: number;
  items: any[];
}

export interface GridError {
  type: 'API_ERROR' | 'VALIDATION_ERROR' | 'NETWORK_ERROR';
  message: string;
  details?: any;
}

export interface GridEventHandlers {
  onRowClick?: (row: GridRow) => void;
  onCellEdit?: (params: {
    rowId: string | number;
    field: string;
    value: any;
    oldValue: any;
  }) => Promise<boolean>;
  onSort?: (config: GridSortConfig) => void;
  onFilter?: (filters: Record<string, any[]>) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
} 