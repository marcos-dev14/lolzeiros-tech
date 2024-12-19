import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

type MenuProps = {
  minimal: boolean;
}

type MenuItemProps = {
  minimal: boolean;
  selected?: boolean;
  orange?: boolean;
}

export const Container = styled.div<MenuProps>`
  display: flex;
  flex-direction: column;
  width: ${({ minimal }) => minimal ? '3.4375rem' : '15.125rem'};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 0.5rem;
  margin-right: 0.625rem;
  position: relative;
`;

export const ShouldSave = styled.div`
  border-radius: 0.5rem;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.4);
  cursor: not-allowed;
`;

export const MenuItem = styled(Link)<MenuItemProps>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 2.125rem;
  padding-left: 2.5rem;
  background-color: ${({ selected }) => selected ? '#FF6F6F' : '#FFF'};
  color: ${({ selected, theme: { colors } }) =>
      selected ? colors.white : colors.text };
  
  &:last-child {
    border-radius: 0 0 0.5rem 0.5rem;
  }

  svg {
    width: 0.875rem;
    margin-right: 0.625rem;
    color: ${({ selected, theme: { colors } }) =>
      selected ? colors.white :  colors.primary};
  }

  p {
    font-size: 0.875rem;
  }

  ${({ minimal }) => minimal && css`
    height: 2.1875rem;
    justify-content: center;
    padding-left: 0;

    &:first-child {
      padding-left: 0;
    }
    
    svg {
      margin-right: 0;
    }
  `};

  &:hover {
    transition: all 0.2s;
    background-color: #FF6F6F;
    
    p, svg {
      transition: all 0.2s;
      color: #fff;
    }
  }
`;

export const SectionMenuItem = styled(MenuItem)<MenuItemProps>`
  background-color:
    ${({ selected, orange }) =>
      selected ? orange ? '#FF6F6F' : '#1279B1' : '#FFF'};
  padding-left: ${({ minimal }) => minimal ? 0 : '1.25rem'};
`;