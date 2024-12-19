import { rotate } from '@/src/components/LoadingContainer/styles';
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

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }

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

    &.load {
      stroke: #0F1331;
      animation: ${rotate} 2s linear infinite;
    }
  }

  &.filter {
    width: 4.3125rem;
    margin-left: auto;
    margin-right: 2.5rem;
  }
`;
