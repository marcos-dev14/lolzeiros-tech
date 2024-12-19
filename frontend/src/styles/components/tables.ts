import { rotate } from "@/src/components/LoadingContainer/styles";
import styled, { css } from "styled-components";

type TableProps = {
  isOnSafari?: boolean;
};

type TableTitleProps = {
  fontSize: string;
  lineHeight: string;
};

type TableActionButtonProps = {
  loading?: boolean;
  backgroundColor?: string;
};

type TableSortingHeaderProps = {
  dir: string;
};

export const MainTable = styled.table<TableProps>`
  width: 100%;
  max-width: 1120px;
  text-align: left;
  font-size: 0.75rem;
  border-collapse: collapse;
  display: table;
  background-color: #fff;

  /* border-radius: 0.25rem 0.25rem 0 0; */

  tbody {
    width: 100%;
  }

  thead {
    height: 2.75rem;
    background-color: #f4f5f8;
    text-transform: uppercase;
    /* border-radius: 0.25rem 0.25rem 0 0; */

    th {
      height: 2.75rem;
      padding: 0 0.625rem;
      border: 2px solid #edeff5;
      border-width: 0 2px;
      font-family: "Roboto";
      font-weight: bold;

      ${({ isOnSafari }) =>
        isOnSafari &&
        css`
          font-family: "Roboto";
          font-weight: bold;
        `}

      div {
        font-family: "Roboto";
        text-transform: none;
      }

      &:first-child {
        border-left: 0;
        border-top-left-radius: 0.25rem;
      }

      &:last-child {
        border-right: 0;
        border-top-right-radius: 0.25rem;
      }
    }
  }

  tr {
    height: 2.75rem;
    max-height: 2.75rem;
    background-color: #fff;
    /* background-color: #404; */

    td {
      padding: 0 1.25rem;

      border: 2px solid #edeff5;

      &:first-child {
        border-left: 0;
      }

      &:last-child {
        border-right: 0;
      }

      div {
        display: flex;
      }
    }
  }
`;

export const TableSortingHeader = styled.span<TableSortingHeaderProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;

  svg {
    transform: ${({ dir }) =>
      `rotate(${dir.includes("-desc") ? "180deg" : "0"})`};
  }
`;

export const TableCheckBox = styled.div<{ selected: boolean }>`
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  border: 1px solid #dbdfeb;
  background-color: ${({ selected }) => (selected ? "#21d0a1" : "#fff")};
`;

export const TableFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.25rem;
  width: 100%;

  p {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.875rem;
    margin-right: auto;
  }
`;

export const TableActionButton = styled.button<TableActionButtonProps>`
  background-color: ${({ backgroundColor }) => backgroundColor || "#fff"};
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
  border: none;

  & + button {
    margin-left: 0.5rem;
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  svg {
    transition: fill 0.2s;

    &.viewBg {
      fill: #f3f4f7;

      .viewIcon {
        stroke: #3699cf;
      }

      &:hover {
        fill: #3699cf;

        .viewIcon {
          stroke: #fff;
        }
      }
    }

    &.viewXBg {
      fill: #f3f4f7;

      .viewXIcon {
        stroke: #fe7572;
      }

      &:hover {
        fill: #fe7572;

        .viewXIcon {
          stroke: #fff;
        }
      }
    }

    &.editBg {
      fill: #f4f5f8;

      .editIcon {
        stroke: #3699cf;
      }

      &:hover {
        fill: #3699cf;

        .editIcon {
          stroke: #fff;
        }
      }
    }

    &.reportBg {
      fill: #f4f5f8;

      .reportIcon {
        fill: #3699cf;
      }

      &:hover {
        fill: #3699cf;

        .reportIcon {
          fill: #fff;
        }
      }
    }

    &.printIconBg {
      fill: #f4f5f8;

      .printIconStroke {
        stroke: #3699cf;
      }

      .printIconFill {
        fill: #3699cf;
      }

      &:hover {
        fill: #3699cf;

        .printIconStroke {
          stroke: #fff;
        }

        .printIconFill {
          fill: #fff;
        }
      }
    }

    &.printBlackIconBg {
      fill: #f4f5f8;

      .printIconStroke {
        stroke: #000;
      }

      .printIconFill {
        fill: #000;
      }

      &:hover {
        fill: #000;

        .printIconStroke {
          stroke: #fff;
        }

        .printIconFill {
          fill: #fff;
        }
      }
    }

    &.plusBg {
      fill: #f3f4f7;

      .plusIcon {
        fill: #21d0a1;
        stroke: #21d0a1;
      }

      &:hover {
        fill: #21d0a1;

        .plusIcon {
          fill: #fff;
          stroke: #fff;
        }
      }
    }

    &.unlockBg {
      fill: #f3f4f7;

      .unlockIcon {
        fill: #21d0a1;
      }

      &:hover {
        fill: #21d0a1;

        .unlockIcon {
          fill: #fff;
        }
      }
    }

    &.blockBg {
      fill: #f3f4f7;

      .blockIcon {
        fill: #ff6f6f;
      }

      &:hover {
        fill: #ff6f6f;

        .blockIcon {
          fill: #fff;
        }
      }
    }

    &.bagBg {
      fill: #f3f4f7;

      .bagIcon {
        fill: none;
        stroke: #21d0a1;
      }

      &:hover {
        fill: #21d0a1;

        .bagIcon {
          stroke: #fff;
        }
      }
    }

    &.bagXBg {
      fill: #f3f4f7;

      .bagXIcon {
        fill: none;
        stroke: #fe726e;
      }

      &:hover {
        fill: #fe726e;

        .bagXIcon {
          stroke: #fff;
        }
      }
    }

    &.uploadBg {
      fill: #f3f4f7;

      .uploadIcon {
        fill: none;
        stroke: #3798cd;
      }

      &:hover {
        fill: #3798cd;

        .uploadIcon {
          stroke: #fff;
        }
      }
    }

    &.expand {
      fill: #fff;

      .expandIcon {
        stroke: #b7bfc9;
      }

      &:hover {
        fill: #dbdfeb;
        transform: rotateX(180deg);
        transform-origin: 50% 50%;

        .expandIcon {
          stroke: #fff;
        }
      }
    }

    &.expandGray {
      fill: #f4f5f8;

      .expandIcon {
        stroke: #b7bfc9;
      }

      &:hover {
        fill: #dbdfeb;
        transform: rotateX(180deg);
        transform-origin: 50% 50%;

        .expandIcon {
          stroke: #fff;
        }
      }
    }

    &.plusWhiteBg {
      fill: #fff;

      .plusWhiteIcon {
        fill: #21d0a1;
        stroke: #21d0a1;
      }

      &:hover {
        fill: #21d0a1;

        .plusWhiteIcon {
          fill: #fff;
          stroke: #fff;
        }
      }
    }

    &.trashBg {
      fill: #f4f5f8;

      .trashIcon {
        stroke: #fd6e63;
      }

      &:hover {
        fill: #fd6e63;

        .trashIcon {
          stroke: #fff;
        }
      }
    }

    &.moveBg {
      fill: #f3f4f7;

      .moveIcon {
        stroke: #3699cf;
      }

      &:hover {
        fill: #3699cf;

        .moveIcon {
          stroke: #fff;
        }
      }
    }

    &.tagBg {
      fill: #f3f4f7;

      .tagIcon {
        stroke: #3699cf;
      }

      .tagCircle {
        fill: #3699cf;
      }

      &:hover {
        fill: #3699cf;

        .tagIcon {
          stroke: #f3f4f7;
        }

        .tagCircle {
          fill: #f3f4f7;
        }
      }
    }
  }

  svg {
    ${({ loading }) =>
      loading &&
      css`
        stroke: #292929;
        width: 1.125rem;
        height: 1.125rem;
        margin-top: 0.375rem;
        animation: ${rotate} 2s linear infinite;
      `};
  }
`;

export const TableTitle = styled.p<TableTitleProps>`
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  width: 100%;
  font-size: ${({ fontSize }) => fontSize};
  line-height: ${({ lineHeight }) => lineHeight};

  a,
  a:visited {
    color: #3699cf;
  }
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
