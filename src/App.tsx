import styled, { ThemeProvider } from 'styled-components';
import theme from './theme';
import GlobalStyles from './globalStyle';
import './App.css';
import MainWrapper from './pages/MainWrapper';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <MainWrapper />
    </ThemeProvider>
  );
}

export default App;
