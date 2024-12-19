import styled from 'styled-components';

export const Container = styled.table`
  width: 100%;
  text-align: left;
  font-size: 0.75rem;
  margin-top: 1.25rem;
  border-collapse: collapse;
  display: table;

  thead {
    height: 2.75rem;
    background-color: #F4F5F8;
    text-transform: uppercase;
    
    th {
      padding-left: 0.625rem;
      border: 2px solid #edeff5;
      border-width: 0 2px;
      font-family: "Roboto";
      font-weight: bold;

      &:first-child {
        border-left: 0;
      }
      
      &:last-child {
        border-right: 0;
      }
    }
  }
  
  tr {
    height: 2.75rem;
    /* background-color: #F4F5F8; */
    background-color: #404;
    
    td {
      padding: 0 0.5rem 0 0.75rem;

      border: 2px solid #edeff5;
      background-color: #fff;

      &:first-child {
        border-left: 0;
      }
      
      &:last-child {
        border-right: 0;
      }

      > div {
        display: flex;
      }
    }
  }
`;
