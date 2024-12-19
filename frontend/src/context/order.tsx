import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

export interface Order {
  client: string;
  code: string;
  created: string;
  id: number;
  status: string;
  suppler: string;
  invoice: [];
  value: string;
  cnpj: string;
}

interface OrderData {
  orders: Order[];
  ordersNew: Order[];
}

interface InvoiceContextProps {
  orderData: OrderData | null;
  setOrderData: Dispatch<SetStateAction<OrderData | null>>;
}

const OrderContext = createContext<InvoiceContextProps | undefined>(undefined);

export const OrderProvider: React.FC = ({ children }) => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  return (
    <OrderContext.Provider value={{ orderData, setOrderData }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }

  return context;
};
