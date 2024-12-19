import styled from 'styled-components';


import { Form } from '@unform/web';
import { buttonStyle } from '~styles/components';

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-90deg, #7faaCF, #3699CF, #7f99CF);
`;

export const Content = styled(Form)`
  border-radius: 1rem;
  height: 24rem;
  width: 22rem;
  background-color: #fbfdfd;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 1.25rem;
  font-size: 0.75rem;

  div {
    label {
      font-size: 0.625rem;
    }
  }
`;

export const SubmitButton = styled.button`
  ${buttonStyle}

  width: 100%;
  background-color: ${({ theme }) => theme.colors.invalidatedBadge};
  margin-top: 1.75rem;

  color: #fff;

  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;