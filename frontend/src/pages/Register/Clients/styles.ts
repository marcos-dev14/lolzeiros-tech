import styled, { keyframes } from 'styled-components';
import { buttonStyle, MainContainer } from '~styles/components';
import { MainTable } from '~styles/components/tables';

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

export const DropdownRowContent = styled.div`
  display: flex;
  gap: 1.875rem;
  width: 100%;
  height: 100%;
`;

export const DropdownContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.625rem;
  background-color: #ffffff;
  border-radius: 3px;
  max-width: 41.688rem;

  h4 {
    font-family: 'Roboto';
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 16.94px;
    text-align: left;
    color: #0c5da7;
  }

  div {
    border: 0.8px solid #36c8b1;
    border-radius: 3px;
    padding: 0.25rem 0.625rem;
    font-family: 'Roboto';
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 14.52px;
    text-align: left;

    span {
      font-weight: 600;
      margin-right: 0.3rem;
    }
  }
`;

export const DropdownRowContentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  justify-content: space-between;

  span {
    height: 0.5rem;
    width: 0.5rem;
    border-radius: 50%;
    background-color: #fe726e;
    margin-right: 0.375rem;
  }

  div {
    display: flex;
    align-items: center;
  }

  p {
    font-size: 0.75rem;

    strong {
      font-family: 'Roboto';
    }

    b {
      font-family: 'Roboto';
      font-weight: bold;
    }
  }
`;

export const ProfileClient = styled.div`
  padding: 0.375rem;
  height: 1.875rem;
  border-radius: 3px;

  display: flex;
  align-items: center;
  gap: 0.3rem;
  background-color: #ffffff;

  font-family: 'Roboto';
  font-size: 0.875rem;
  line-height: 1.059rem;
  font-weight: 300;
  text-align: left;
  text-transform: capitalize;

  span {
    font-weight: 600;
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

  &.sendMail {
    width: 12.875rem;
    margin-left: 1.25rem;
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

export const TagContainer = styled.div`
  width: 100%;
  border-radius: 0.25rem;
  height: 2rem;
  display: flex;
  align-items: center;
  padding-left: 0.375rem;
  overflow-x: scroll;

  scrollbar-width: none;
  -ms-overflow-style: none;

  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    background: transparent;
  }
`;

export const Tag = styled.div`
  /* display: inline-flex; */
  display: flex;
  flex-shrink: 0;
  background-color: #25cfa1;
  height: 1.25rem;
  border-radius: 0.25rem;
  padding: 0 0.625rem 0 0.5rem;
  color: #fbfbfd;
  align-items: center;
  font-size: 0.75rem;

  & + div {
    margin-left: 0.625rem;
  }
`;
