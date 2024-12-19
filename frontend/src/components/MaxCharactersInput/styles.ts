import styled from 'styled-components';
import { BoxInput } from '../../styles/components/box';

export const Input = styled(BoxInput)`
  border-radius: 0.25rem;
  border-left-width: 1px;
  padding-left: 0.625rem;
`;

export const MaxCharacters = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  p {
    font-size: 0.75rem;
    margin-left: 0.625rem;
  }
`;