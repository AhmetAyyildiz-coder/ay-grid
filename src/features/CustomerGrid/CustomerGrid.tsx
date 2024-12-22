import { BaseGrid } from '../../core/components/grid/base/BaseGrid';
import { GridColumn } from '../../core/components/grid/base/BaseGrid.types';
import './CustomerGrid.css';

interface Customer {
  customerId: string;
  companyName: string;
  contactName: string;
  contactTitle: string;
  address: string;
  city: string;
}

export function CustomerGrid() {
  const gridConfig = {
    title: 'Müşteri Listesi',
    keyField: 'customerId',
    columns: [
      { id: 'customerId', label: 'Müşteri ID', sortable: true },
      { id: 'companyName', label: 'Şirket Adı', sortable: true },
      { id: 'contactName', label: 'İletişim Kişisi', sortable: true },
      { id: 'contactTitle', label: 'Ünvan', sortable: true },
      { id: 'address', label: 'Adres' },
      { id: 'city', label: 'Şehir', sortable: true, filterable: true }
    ] as GridColumn[],
    dataSource: {
      remote: {
        url: 'https://localhost:7189/api/Customers/GetCustomers',
        method: 'GET' as const,
        transformResponse: (response: Customer[]) => response,
        params: {
          pageSize: 50,
          pageNumber: 1
        }
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
        key: 'customer-grid-data'
      }
    },
    refreshInterval: 0,
    initialLoadDelay: 0
  };

  const renderCustomHeader = () => (
    <div className="customer-grid-header">
      <h2>Müşteri Yönetimi</h2>
    </div>
  );

  const renderCustomCell = (column: GridColumn, row: Customer) => {
    switch (column.id) {
      case 'companyName':
        return (
          <div className="company-name-cell">
            <strong>{row.companyName}</strong>
          </div>
        );
      case 'contactName':
        return (
          <div className="contact-info-cell">
            <div>{row.contactName}</div>
            <small className="contact-title">{row.contactTitle}</small>
          </div>
        );
      case 'address':
        return (
          <div className="address-cell">
            <div>{row.address}</div>
            <small className="city">{row.city}</small>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <BaseGrid<Customer>
      {...gridConfig}
      renderCustomHeader={renderCustomHeader}
      renderCustomCell={renderCustomCell}
      handleError={(error: Error) => {
        console.error('Müşteri grid hatası:', error);
      }}
    />
  );
}
