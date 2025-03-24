import styled, { ThemeProvider } from 'styled-components';
import theme from './theme';
import GlobalStyles from './globalStyle';
import './App.css';
import MainWrapper from './pages/MainWrapper';
// import MapsWrapper from './pages/MapsWrapper';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CafeWrapper from './pages/CafeWrapper';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Routes>
          <Route path="/" element={<MainWrapper />} />
          <Route path="/cafe" element={<CafeWrapper />} />
          {/* <Route path="/map" element={<MapsWrapper />} /> */}
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
