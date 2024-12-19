import styled, { keyframes } from 'styled-components';
import { buttonStyle, MainContainer } from '~styles/components';
import { MainTable, TableActionButton } from '~styles/components/tables';

export const Container = styled(MainContainer)`
  max-width: 1160px;
`;

export const Table = styled(MainTable)`
  margin-top: 1.25rem;
  padding-bottom: 2rem;
  position: relative;
  background-color: #fff;

  tbody {
    td {
      padding: 0 0.625rem;
    }
  }

  tr {
    &:hover{
      position: relative;
      width: 100%;
      background-color: #fff;
    }
  }
`;

export const ReportMessage = styled.div<{ leftPos: number }>`
  max-width: 1160px;
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  top: -2rem;
  left: ${({ leftPos }) => leftPos}px;
  z-index: 999;
  padding: 1rem 1.5rem;
  text-align: center;

  p {
    color: ${({ theme }) => theme.colors.text};
    font-size: 1rem;
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
  width: 14.375rem;

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.newTemplate {
    margin-top: 1.875rem;
    width: 100%;
  }

  &.import {
    /* margin: 1.875rem 0 0 1; */
    margin-left: 2rem;
    align-self: flex-end;
    width: 14.375rem;
  }

  &.revert {
    /* margin: 1.875rem 0 0 1; */
    background-color: #FE726E;
    color: #fff;

    svg.revert {
      stroke: #fff;
      animation: ${rotate} 2s linear infinite;
    }

    &:hover {
      transition: all 0.2s;
      background-color: #D65D5D;
    }
  }

  svg.load {
    stroke: #0F1331;
    animation: ${rotate} 2s linear infinite;
  }
`;

export const AddButton = styled(TableActionButton)`
  margin-left: 1.25rem;
  margin-top: auto;
  margin-right: auto;
`;

export const GoBackButton = styled.button`
  ${buttonStyle}

  width: 6.25rem;
  background-color: #78C5F0;
  color: #fff;
  
  svg {
    margin-right: 0.25rem;
    width: 0.9375rem;
    height: 0.9375rem;
  }
`;
