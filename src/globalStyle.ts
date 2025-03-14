import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

/*
최대 width : 640px 
선정 이유 : tailwind css에서 sm의 최대 넓이가 640px로 설정되어있음
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
      max-width:640px;
      margin:0 auto;
      background-color:red;
    }
`;

export default GlobalStyles;
