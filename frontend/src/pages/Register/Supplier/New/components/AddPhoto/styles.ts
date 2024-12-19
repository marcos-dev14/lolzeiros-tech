import styled, { css } from 'styled-components';

export const Container = styled.div<{ hasPicture: boolean }>`
  display: flex;
  flex-direction: column;
  width: 12.5rem;
  height: 6.25rem;
  border-radius: 0.5rem;
  padding: 0.625rem;
  position: relative;
  transition: all 0.2s;

  &[disabled] {
    opacity: 0.6;
  }

  ${({ hasPicture }) => hasPicture && css`
    > button {
      opacity: 0;
    }
    
    &:hover {
      > button {
        opacity: 1;
      }
    }
  `}
`;

export const Picture = styled.img`
  width: 100%;
  height: 6.25rem;
  border-radius: 0.5rem;
  object-fit: cover;
  background-color: #DBDFEB;
`;

export const DropPicture = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #FF7373;
  top: 0;
  left: 0;
`;

export const SetPicture = styled.button`
  position: absolute;
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 50%;
  background-color: #FF7373;
  
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
