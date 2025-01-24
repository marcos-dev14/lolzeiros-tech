import React from "react";
import styled from "styled-components";

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Card = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SellerName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #444;
`;

const SupplierName = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

export const SellersList = ({ clientsSeller }: { clientsSeller: { seller_id: number; seller_name: string; supplier_id: number; supplier_name: string }[] }) => (
  <div>
    <InputContainer>
      {clientsSeller.map((client) => (
        <Card key={client.seller_id}>
          <SellerName>{client.seller_name}</SellerName>
          <SupplierName>Fornecedor: {client.supplier_name}</SupplierName>
        </Card>
      ))}
    </InputContainer>
  </div>
);
