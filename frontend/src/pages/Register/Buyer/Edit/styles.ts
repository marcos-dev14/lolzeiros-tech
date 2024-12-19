import { darken } from 'polished';
import styled, { keyframes } from 'styled-components';
import { buttonStyle, MainContainer } from '~styles/components';

export const Container = styled(MainContainer)`
  max-width: 1160px;
  width: 1160px;
`;

const rotate = keyframes`
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
  width: 100%;
  margin-left: 2rem;

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg.load {
    stroke: #0F1331;
    animation: ${rotate} 2s linear infinite;
  }
`;

export const BadgeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 21.875rem);
  gap: 1.25rem;
  margin-top: 1.5rem;
`;

export const Badge = styled.div`
  width: 21.875rem;
  background-color: #F3F4F7;
  border-radius: 1.25rem;
  padding: 1.875rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  min-height: 10.8125rem;

  strong {
    font-size: 1.125rem;
    text-transform: uppercase;
    color: #005CAC;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    height: 2.75rem;
    max-width: 90%;
  }

  > p {
    color: #040C22;
    margin-top: 0.75rem;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.375rem;
  }
`;

export const GoBackButton = styled.button`
  ${buttonStyle}

  margin-left: auto;
  width: 6.25rem;
  background-color: #78C5F0;
  color: #fff;
  
  svg {
    margin-right: 0.25rem;
    width: 0.9375rem;
    height: 0.9375rem;
  }
  
  &:hover {
    transition: all 0.2s;
    background-color: ${darken('0.2', '#78C5F0')};
  }
`;
