import { createGlobalStyle } from "styled-components";

// import Roboto from '../assets/fonts/SanFrancisco.otf';
// import SFProBold from '../assets/fonts/SanFranciscoBold-original.otf';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }
  
  *:focus{
    outline: 0;
  }

  body {
    -moz-font-smoothing: antialiased !important;
    -webkit-font-smoothing: subpixel-antialiased !important;
  }
  
  body, input {
    font-size: 1rem;
    font-family: "Roboto", sans-serif;
    color: ${({ theme }) => theme.colors.text}
  }

  body {
    background-color: #F4F5F6;
  }
  
  a {
    text-decoration: none;
  }
    
  button, label {
    font-family: "Roboto", sans-serif;
    cursor: pointer;
    border: none;
  }

  .ck, .ck-content, .ck-editor__editable, .ck-rounded-corners, .ck-editor__editable_inline, .ck-blurred {
    line-height: 1.875rem;

    > ul {
      padding-left: 1rem;
    }

    > p {
      margin-bottom: 0.625rem;
    }
  }
`;