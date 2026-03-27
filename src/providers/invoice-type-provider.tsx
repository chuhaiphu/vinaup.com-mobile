import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getInvoiceTypesApi } from '@/apis/invoice-apis';
import { InvoiceTypeResponse } from '@/interfaces/invoice-type-interfaces';

interface InvoiceTypeContextType {
  invoiceTypes: InvoiceTypeResponse[];
  loading: boolean;
  refresh: () => void;
  getInvoiceTypeByCode: (code: string) => InvoiceTypeResponse | undefined;
  getInvoiceTypeById: (id: string) => InvoiceTypeResponse | undefined;
}

const InvoiceTypeContext = createContext<InvoiceTypeContextType>({
  invoiceTypes: [],
  loading: false,
  refresh: () => {},
  getInvoiceTypeByCode: () => undefined,
  getInvoiceTypeById: () => undefined,
});

export function useInvoiceTypeContext() {
  return useContext(InvoiceTypeContext);
}

export const InvoiceTypeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [invoiceTypes, setInvoiceTypes] = useState<InvoiceTypeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchInvoiceTypes();
  }, []);

  const fetchInvoiceTypes = async () => {
    setLoading(true);
    try {
      const response = await getInvoiceTypesApi();
      if (response.data) {
        setInvoiceTypes(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách loại hoá đơn:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInvoiceTypeByCode = useCallback(
    (code: string) => invoiceTypes.find((t) => t.code === code),
    [invoiceTypes]
  );

  const getInvoiceTypeById = useCallback(
    (id: string) => invoiceTypes.find((t) => t.id === id),
    [invoiceTypes]
  );

  return (
    <InvoiceTypeContext
      value={{
        invoiceTypes,
        loading,
        refresh: fetchInvoiceTypes,
        getInvoiceTypeByCode,
        getInvoiceTypeById,
      }}
    >
      {children}
    </InvoiceTypeContext>
  );
};
