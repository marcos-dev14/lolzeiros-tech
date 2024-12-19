import styled from 'styled-components';

export const Title = styled.h1`
  font-family: "Roboto";
  font-weight: bold;
  color: #21D0A1;
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
`;