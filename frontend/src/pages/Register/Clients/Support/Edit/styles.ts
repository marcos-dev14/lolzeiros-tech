import styled, { keyframes } from 'styled-components';
import { buttonStyle, MainContainer } from '~styles/components';

export const Container = styled(MainContainer)`
  max-width: 1346px;
  height: 989px;
`;

const rotate = keyframes` /** widtwidtwidth: 840px;h: 840px;h: 840px;animação para rotacionar o icon. */
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Button = styled.button`
  ${buttonStyle}
  color: #0F1331;
  width: 8rem;

  &.newProduct {
    width: 14.375rem;
    margin-left: auto;
  }

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg.load {
    stroke: #0F1331;
    animation: ${rotate} 2s linear infinite;
  }
`;

export const ReplyContainer = styled.div`
  display: flex;
  gap: 0 1rem;
  margin-top: 1.25rem;
  align-items: flex-start;
  height: 17.625rem;
  
  img {
    width: 3.25rem;
    height: 3.25rem;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const ReplyContainerInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  button {
    ${buttonStyle}

    margin-top: 1.625rem;
  }
`;

export const AvatarContainer = styled.div`
  display: flex;

  > div {
    display: flex;
    flex-direction: column;
    margin-right: 1rem;
    text-align: right;

    > strong {
      font-size: 0.875rem;
      color: ${({ theme }) => theme.colors.text};
    }
    
    small {
      text-align: right;
      margin-top: 0.75rem;
      color: #b7bfc9;
      font-size: 0.875rem;

      b {
        font-family: "Roboto";
        font-weight: bold;
      }
    }
  }
  
  img {
    width: 3.25rem;
    height: 3.25rem;
    border-radius: 50%;
  }
`;

export const Options = styled.div`
  width: 1104px;
  display: flex;
  justify-content: space-between;
  margin-top: 1.25rem;

  > button {
    ${buttonStyle};
    width: 12.5rem;
    margin-left: auto;
  }
`;

export const AttachmentContainer = styled.div`
  display: grid;
  grid-template-columns: 12.5rem auto;
  align-items: center;
  gap: 0 1.25rem;

  button {
    ${buttonStyle};
    
    width: 12.5rem;
    
    svg {
      margin-right: 0.25rem;
    }
  }

  p {
    color: #B7BFC9;
    font-size: 0.75rem;
  }
`;