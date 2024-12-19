import styled from 'styled-components';


import { Form } from '@unform/web';
import { buttonStyle } from '~styles/components';

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-90deg, #3699CF, #1378AF, #7f99CF);
`;

export const Content = styled(Form)`
  border-radius: 1rem;
  /* height: 45rem; */
  width: 41rem;
  background-color: #fbfdfd;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 3.5rem 1.25rem;
  font-size: 0.75rem;

  div {
    label {
      font-size: 0.625rem;
    }
  }
`;

export const Avatar = styled.img`
  height: 8rem;
  width: 8rem;
  border-radius: 4rem;
  background-color: #eee;
  border: 4px solid ${({ theme }) => theme.colors.medium_gray};
`;

export const SubmitButton = styled.button`
  ${buttonStyle}

  width: 20rem;
  background-color: ${({ theme }) => theme.colors.invalidatedBadge};
  margin-top: 1.75rem;

  color: #fff;

  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;