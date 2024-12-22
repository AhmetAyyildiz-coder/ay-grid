import { BaseGrid } from '../../core/components/grid/base/BaseGrid';
import { GridColumn } from '../../core/components/grid/base/BaseGrid.types';


interface Order {
  orderId: string;
  employeeId: number;
  customerId: string;
  shipCountry: string;
  freight: number;
}

export function OrderGrid() {
  const gridConfig = {
    title: 'Sipariş Listesi',
    keyField: 'orderId',
    columns: [
      { id: 'orderId', label: 'OrderID', sortable: true, width: 100, filterable: true },
      { id: 'employeeId', label: 'EmployeeID', sortable: true, width: 100, filterable: true },
      { id: 'customerId', label: 'CustomerID', sortable: true, width: 120, filterable: true },
      { id: 'shipCountry', label: 'ShipCountry', sortable: true, width: 150, filterable: true },
      { id: 'freight', label: 'Freight', sortable: true, width: 100, filterable: true }
    ] as GridColumn[],
    dataSource: {
      remote: {
        url: 'https://localhost:7189/api/Customers/GetOrders',
        method: 'GET' as const,
        transformResponse: (response: Order[]) => response
      }
    },
    optimizations: {
      virtualScroll: {
        enabled: true,
        rowHeight: 48,
        bufferSize: 10
      },
      caching: {
        enabled: true,
        duration: 5 * 60 * 1000,
        strategy: 'localStorage' as const,
        key: 'order-grid-data'
      }
    }
  };

  return (
    <BaseGrid<Order>
      {...gridConfig}
      handleError={(error: Error) => {
        console.error('Sipariş grid hatası:', error);
      }}
    />
  );
} 