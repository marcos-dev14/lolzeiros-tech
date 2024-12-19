import { darken } from 'polished';
import styled from 'styled-components';

export const Title = styled.h1`
  font-family: "Roboto";
  font-weight: bold;
  color: #FE726E;
  font-size: 2.5rem;
  text-align: center;
  margin-top: 1rem;
`;

export const Description = styled.p`
  color: #272E47;
  font-size: 1.125rem;
  line-height: 1.5rem;
  text-align: center;
  margin-top: 1.25rem;

  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  height: 4.25rem;

  b {
    text-transform: uppercase;
    font-family: "Roboto";
    font-weight: bold;
  }
`;

export const Button = styled.button`
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.125rem;
  margin-top: 1.25rem;
  height: 3.25rem;
  width: 40%;
  background-color: ${({ theme }) => theme.colors.medium_gray};
  
  &:hover {
    transition: all 0.2s;
    background-color: ${({ theme }) => darken('0.075', theme.colors.medium_gray)};
  }
`;

export const ConfirmationButton = styled(Button)`
  background-color: #FD7267;
  font-family: "Roboto";
  font-weight: bold;
  color: #fff;
  width: 80%;
  margin-top: 0.5rem;
  height: 3.75rem;

  &:hover {
    transition: all 0.2s;
    background-color: ${({ theme }) => darken('0.075', '#FD7267')};
  }

`;