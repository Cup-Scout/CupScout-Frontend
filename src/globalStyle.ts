import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

/*
최대 width : 440px 
선정 이유 : Iphone 16 pro max 가준
*/

const GlobalStyles = createGlobalStyle` 
  ${reset} 
    a{
        text-decoration: none;
        color: inherit;
    }
    *{
        box-sizing: border-box;
    }
    input, textarea { 
      -moz-user-select: auto;
      -webkit-user-select: auto;
      -ms-user-select: auto;
      user-select: auto;
    }
    input:focus {
      outline: none;
    }

    button {
      border: none;
      background: none;
      padding: 0;
      cursor: pointer;
    }

    .wrapper {
      max-width:440px;
      margin:0 auto;
      padding: 20px;
      border:1px solid #ccc
    }
`;

export default GlobalStyles;
