const colors = {
  boxBackground: '#F8F8F8',
};

const shadow = {
  shadowColor: '3px 3px 8px rgba(0, 0, 0, 0.2);',
};

/*
최대 width : 640px 
선정 이유 : tailwind css에서 sm의 최대 넓이가 640px로 설정되어있음
*/

const responsive = {
  sm: '640px',
};

const theme = {
  colors,
  shadow,
  responsive,
};

export default theme;
