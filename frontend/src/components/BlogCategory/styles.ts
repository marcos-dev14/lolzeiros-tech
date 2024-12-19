import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 1.25rem;
`;

export const Header = styled.div`
  display: grid;
  grid-template-columns: 6% 64% 11% 7% 12%;
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

export const Content = styled.div`
  display: grid;
  grid-template-columns: 6% 31% 55% 8%;
  width: 100%;
  background-color: #fff;
  height: 2.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.medium_gray};
    
  &:nth-child(2) {
    /* background-color: #f09; */
    border-top: 1px solid ${({ theme }) => theme.colors.medium_gray};
  }

  > div {
    display: flex;
    align-items: center;
    padding: 0 0.625rem;
    height: 2.75rem;

    &:not(:first-child) {
      border-left: 1px solid ${({ theme }) => theme.colors.medium_gray};
    }

    &:last-child {
      padding-right: 0.375rem;
      justify-content: space-between;
    }
  }
`;

export const ArrangeOrderButton = styled.button`
  width: 100%;
  height: 2rem;
  border-radius: 0.25rem;
  background: none;

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

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
