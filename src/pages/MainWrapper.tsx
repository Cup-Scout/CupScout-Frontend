import styled from 'styled-components';
import sampleCafeImg from '../assets/sampleCafe.png';

const MainWrapper = () => {
  return (
    <Main className="wrapper">
      <Nav>
        <ul>
          <li>
            <p>
              <span>📝</span>공부하기 좋은 카페
            </p>
          </li>
          <li>
            <p>
              <span>📚</span>북카페
            </p>
          </li>
          <li>
            <p>
              <span>🍧</span>빙수 맛집
            </p>
          </li>
          <li>
            <p>
              <span>🎡</span>추억의 장소
            </p>
          </li>
        </ul>
      </Nav>
      <Article>
        {/* <img src={sampleCafeImg} alt="" /> */}
        <section></section>
        <div>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat
          facere saepe ullam adipisci fugit deleniti, magni, veniam,
        </div>
      </Article>
    </Main>
  );
};

const Main = styled.main`
  height: 100vh;
`;

const Nav = styled.nav`
  ul {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 두 개씩 배치 */
    row-gap: 15px;
    column-gap: 15px;

    li {
      text-align: center;
      position: relative;
      border-radius: 20px;
      background-color: ${(props) => props.theme.colors.boxBackground};
      box-shadow: 3px 3px 4px rgba(42, 42, 42, 0.1);
      cursor: pointer;
      p {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
      }
      span {
        display: block;
        font-size: 2.5rem;
        margin-bottom: 5px;
      }

      /* aspect-ratio 속성으로 정방형 유지 */
      aspect-ratio: 1;
      width: 100%; /* 가로 길이가 100%로 채워지도록 설정 */
    }
  }
  /* @media (max-width: 400px) {
    ul {
      grid-template-columns: repeat(1, 1fr);
    }
  } */
`;

const Article = styled.article`
  border: 1px solid #eee;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 20px;
  box-shadow: 3px 3px 4px rgba(42, 42, 42, 0.1);

  section {
    width: 100%;
    height: 100px;
    background-image: url('../../public/sampleCafe.png');
    background-color: transparent;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: top;
  }
  div {
    padding: 10px;
    font-size: 14px;
  }
`;

export default MainWrapper;
