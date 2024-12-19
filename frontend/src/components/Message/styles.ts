import styled, { css } from 'styled-components';

type MessageProps = {
  sender: boolean;
}

export const Container = styled.div<MessageProps>`
  display: flex;
  gap: 0 1rem;
  margin-top: 1.25rem;
  
  img {
    width: 3.25rem;
    height: 3.25rem;
    border-radius: 50%;
    object-fit: cover;
  }

  ${({ sender }) => !!sender && css`
    flex-direction: row-reverse;
  `};
`;

export const MessageInfo = styled.div<MessageProps>`
  display: flex;
  flex-direction: column;
  height: 2.75rem;
  min-width: 7rem;
  justify-content: space-between;

  ${({ sender }) => !!sender && css`
    text-align: right;
  `};

  strong {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text};
  }
  
  small {
    color: #b7bfc9;
    font-size: 0.875rem;

    b {
      font-family: "Roboto";
      font-weight: bold;
    }
  }
`;

export const Content = styled.div`
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #DBDFEB;
  border-radius: 0.75rem;
  min-height: 4rem;
  display: flex;
  flex-direction: column;

  textarea {
    font-family: "Roboto";
    width: 100%;
    resize: none;
    border: 0;
    font-size: 0.75rem;
  }

  > div {
    margin-top: 1.125rem;
    display: grid;
    grid-template-columns: 14rem;
    gap: 0.625rem;
    padding: 0 0.625rem 0.625rem;
  }
`;

export const Attachment = styled.div`
  width: 14rem;
  height: 10.75rem;
  border-radius: 0.75rem;
  background-color: #666;
  display: grid;
  place-items: center;
  /* opacity: 0.2; */
  position: relative;
  cursor: pointer;

  &:hover {
    img {
      filter: brightness(0.4);
    }
  }

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  img {
    transition: all 0.2s;
    width: 100%;
    height: 100%;
    border-radius: 0.75rem;
  }
`;

