import React from 'react';
import { GridColumn } from '../base/Grid.types';
import { GridEvents } from '../types/GridEvents.types';
import { GridVirtualScrollConfig } from '../types/GridDataManager.types';

interface GridBodyProps<T = any> {
  data: T[];
  columns: GridColumn[];
  keyField: string;
  renderCustomCell?: (column: GridColumn, row: T) => React.ReactNode;
  events?: GridEvents<T>;
  virtualScrollConfig?: GridVirtualScrollConfig;
  optimizations?: any;
}

export const GridBody = <T extends Record<string, any>>(props: GridBodyProps<T>) => {
  const renderCell = (row: T, column: GridColumn) => {
    const value = row[column.id];
    return column.format ? column.format(value) : value;
  };
  return (
    <div className="grid-body">
      <table>
        <tbody>
          {props.data.map((row) => (
            <tr 
              key={row[props.keyField]} 
              onClick={() => props.events?.onRowClick?.(row)}
            >
              {props.columns.map(column => (
                <td key={column.id}>
                  {props.renderCustomCell ? props.renderCustomCell(column, row) : renderCell(row, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}