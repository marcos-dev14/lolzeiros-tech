import styled, { keyframes } from 'styled-components';
import { buttonStyle, MainContainer, SectionTitle } from '~styles/components';

export const Container = styled(MainContainer)`
  max-width: 1160px;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const CustomSectionTitle = styled(SectionTitle)`
  margin-top: 1.25rem;
`;

export const Button = styled.button`
  ${buttonStyle}
  color: #0F1331;
  width: 8rem;
  margin-left: 1.25rem;

  &.validate {
    width: 9.375rem;
    color: #fff;
    background-color: #21D0A1;
  }

  &.updatePassword {
    width: 12.5rem;
  }

  &.save {
    width: 17.8125rem;
    margin-top: 1.25rem;
    margin-left: auto;
  }

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg.load {
    stroke: #0F1331;
    animation: ${rotate} 2s linear infinite;
  }
`;

export const ColumnInputContainer = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    &:not(:first-child){
      margin-top: .75rem;
    }
  }
`;

export const CodeContainer = styled.div`
  margin-top: 1.25rem;
  
  label {
    font-size: 0.5rem;
    text-transform: uppercase;
    font-family: "Roboto";
    font-weight: bold;
    
    b {
      font-size: 0.625rem;
      font-family: "Roboto";
      font-weight: bold;    
      color: #FF6F6F;
    }
  }
  
  div {
    margin-top: .5rem;
    border-radius: 0.25rem;
    background-color: #292929;
  }
`;