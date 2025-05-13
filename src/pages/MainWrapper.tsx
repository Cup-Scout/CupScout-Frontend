import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const MainWrapper = () => {
  const navigate = useNavigate();
  const [categoryListArr, setCategoryListArr] = useState<categoryInfo[]>([]);

  const getCategory = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_LOCAL_API_URL}/api/categories`,
    );
    const categoryList = await response.json();
    setCategoryListArr(categoryList);
  };

  useEffect(() => {
    getCategory();
  }, []);

  const categoryIcon = {
    STUDY: { icon: '📝' },
    BOOK: { icon: '📚' },
    BINGSOO: { icon: '🍧' },
    MEMORY: { icon: '🎡' },
    DESERT: { icon: '🍰' },
    COFFEE: { icon: '☕️' },
    VIEW: { icon: '🏞️' },
    LARGE: { icon: '🌈' },
  } as const;

  type CategoryKey = keyof typeof categoryIcon;

  interface categoryInfo {
    category: CategoryKey;
    created: string;
    description: string;
    id: number;
    updated: string;
  }

  return (
    <Main className="wrapper">
      <Nav>
        <ul>
          {/* <li onClick={() => navigate('/cafe', { state: 999 })}>
            <p>
              <span>☕️</span>모든 카페
            </p>
          </li> */}
          {categoryListArr.map(
            (value, index) =>
              index < 4 && (
                <li
                  key={value.id}
                  onClick={() => navigate('/cafe', { state: value.id })}
                >
                  <p>
                    <span>{categoryIcon[value.category].icon}</span>
                    {value.description}
                  </p>
                </li>
              ),
          )}
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
    background-image: url('/sampleCafe.png');
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
