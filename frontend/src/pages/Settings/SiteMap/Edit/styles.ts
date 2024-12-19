import { Input } from '@/src/components/Input';
import { BoxBadge } from '@/src/styles/components/box';
import styled from 'styled-components';
import { buttonStyle, MainContainer } from '~styles/components';

export const Container = styled(MainContainer)`
  max-width: 1160px;
  min-height: 600px;
`;

export const CustomHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  div {
    display: flex;
  }
`;

export const Button = styled.button`
  ${buttonStyle}
  color: #0F1331;
  width: 19rem;

  svg {
    transition: all 0.5s;
    
    &.sortIcon {
      transition: all 0.5s;
      fill: #DCDDEC;

      .sortBg {
        fill: #DCDDEC;
      }

      .sortLetter {
        fill: black;
      }

      .sortLetterUnderline {
        stroke: black;
      }

      .sortArrow1 {
        fill: #272E47;
        stroke: #272E47;
      }
      
      .sortArrow2 {
        fill: white;
        stroke: white;
      }

      &:hover {
        transition: all 0.5s;

        .sortBg {
          fill: #494949;
        }

        .sortLetter {
          fill: white;
        }

        .sortLetterUnderline {
          stroke: white;
        }

        .sortArrow1 {
          fill: white;
          stroke: white;
        }

        .sortArrow2 {
          fill: #ccc;
          stroke: #ccc;
        }
      }
    }
  }

  &.filter {
    width: 4.3125rem;
    margin-left: auto;
    margin-right: 2.5rem;
  }
`;

export const ListHeader = styled.div`
  display: grid;
  grid-template-columns: 6% 16% 16% 57% 5%;
  width: 100%;
  border-radius: 0.25rem 0.25rem 0 0;
  background-color: #F4F5F8;
  height: 2.75rem;

  strong {
    font-size: 0.75rem;
    font-family: "Roboto";
    font-weight: bold;
    text-transform: uppercase;
  }

  > div {
    display: flex;
    align-items: center;
    padding: 0 0.625rem;

    &:not(:first-child) {
      border-left: 1px solid ${({ theme }) => theme.colors.medium_gray};
    }

    &:last-child {
      justify-content: space-between;
    }
  }
`;

export const ProductsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* background-color: #ff0; */
  margin-top: 1.875rem;
  
  > div {
    display: flex;
    height: 2.75rem;
    align-items: center;
    width: 100%;
    /* background-color: #f90; */

    &:first-child, & + div {
      border-top: 1px solid #ccc;
    }
    
    &:last-child {
      border-bottom: 1px solid #ccc;
    }

  }
`;