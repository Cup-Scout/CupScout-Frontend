import styled, { ThemeProvider } from 'styled-components';
import theme from './theme';
import GlobalStyles from './globalStyle';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
    </ThemeProvider>
  );
}

export default App;
