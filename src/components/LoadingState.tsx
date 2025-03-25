import styled, { keyframes } from 'styled-components';

const LoadingState = () => {
  return (
    <Container>
      <Spinner id="spinner"></Spinner>
    </Container>
  );
};

const spin = keyframes`
100% {
      transform: rotate(360deg);
}
`;
const Container = styled.div`
  width: 30px;
  height: 30px;
  margin: 0 auto;
  border: 1px solid white;
`;

const Spinner = styled.div`
  margin: calc(50% - 15px) auto;
  width: 30px;
  height: 30px;
  box-sizing: border-box;
  border: 3px solid rgba(69, 69, 69, 0.3);
  border-top-color: #fff;
  border-radius: 100%;

  animation: ${spin} 1s ease-in-out infinite;
`;

export default LoadingState;
