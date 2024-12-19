import styled, { keyframes } from "styled-components";
import { buttonStyle, MainContainer } from "~styles/components";
import { MainTable } from "~styles/components/tables";

export const Container = styled(MainContainer)`
  max-width: 1160px;
`;

export const Table = styled(MainTable)`
  margin-top: 1.25rem;
  padding-bottom: 2rem;
`;

export const TableHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  div {
    display: flex;
  }
`;

const rotate = keyframes` /** widtwidtwidth: 840px;h: 840px;h: 840px;animação para rotacionar o icon. */
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Button = styled.button`
  ${buttonStyle}
  color: #0F1331;
  width: 8rem;

  &.newProduct {
    width: 14.375rem;
    margin-left: 2.5rem;
  }

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg.load {
    stroke: #0f1331;
    animation: ${rotate} 2s linear infinite;
  }
`;

export const BoxModal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1rem;
`;

export const ButtonCleanerFilters = styled.button`
  background-color: transparent;
  color: #5f5f5f;
  opacity: 0.54;
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const ButtonFilter = styled.button`
  padding: 1rem;
  border-radius: 0.5rem;
  background: #39c6f2;
  color: #ffffff;
  font-size: 0.8rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;