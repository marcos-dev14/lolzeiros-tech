import styled from 'styled-components';

type HeaderProps = {
  minimal?: boolean;
}

export const Background = styled.header`
  background-color: ${({ theme }) => theme.colors.white};
  width: 100%;
  box-shadow: 0px 3px 6px #00000029;
  padding: 0 2.5rem 0 1.5rem;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3.5rem;
  width: 100%;
  max-width: 1412px;
  margin: 0 auto;

  > svg {
    color: #FF6F6F;
  }
`;

export const Menu = styled.div<HeaderProps>`
  margin-right: 1.25rem;
  margin-left: ${({ minimal }) => minimal ? '1.5rem' : '3.25rem'};
  width: 1.25rem;
  height: 1.25rem;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const BreadCrumb = styled.strong`
  font-family: "Roboto";
  font-weight: normal;
  
  p {
    display: inline;
  }

  b {
    font-weight: normal;
  }

  p:last-child {
    color: #1378AF;
    b {
      color: #1378AF;
    }
  }

`;

export const HelpMeButton = styled.button`
  margin-left: auto;
  background-color: ${({ theme }) => theme.colors.gray};
  padding: 0 1.25rem;
  border-radius: 0.5rem;
  height: 2.75rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.25rem;
  }
  
  p {
    text-align: left;
    font-size: 0.75rem;
    font-weight: 500;
  }
`;

export const Inbox = styled.button`
  margin: 0 2.125rem 0 3.25rem;
  width: 1.75rem;
  height: 1.5rem;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const Profile = styled.button`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};

  img { 
    width: 2.375rem;
    height: 2.375rem;
    margin-right: 0.5rem;
    border-radius: 50%;
  }

  p {
    text-align: left;
    font-size: 0.875rem;
    color: #0F1331;
  }
`;

export const Separator = styled.div`
  width: 2px;
  background-color: #dbdfeb;
  height: 40%;
  margin: 0 1.25rem;
`;