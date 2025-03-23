import { useState } from 'react';
import styled from 'styled-components';
import bottomArrow from '../assets/bottom-arrow.png';
import sampleCafe from '../assets/sampleCafe.png';

interface cafeInfo {
  id: number;
  name: string;
  address_doro: string;
  lat: number | null;
  lng: number | null;
  description: string | null;
  categories: string | null;
  visible: number;
  deleted: number;
  created: string;
  updated: string;
}

interface cafeListArrProps {
  cafeListArr: cafeInfo[];
}

interface commentList {
  id: number;
  nickname: string;
  password: string;
  content: string;
}

const CafeList = ({ cafeListArr }: cafeListArrProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [switchContent, setSwitchContent] = useState(false);
  const commentList: commentList[] = [
    {
      id: 1,
      nickname: 'wlgus',
      password: '1111',
      content: '책도 많고 재밌다',
    },
    {
      id: 2,
      nickname: 'tnals',
      password: '2222',
      content: '사람이 좀 많고 시끄럽긴 한데 넓어서 좋아요',
    },
  ];

  const toggleExpand = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null); // 클릭한 항목이 이미 열려 있으면 닫기
    } else {
      setExpandedId(null); // 기존에 열려 있던 항목을 즉시 닫기
      setExpandedId(id);
    }
  };

  const toggleContent = () => {
    setSwitchContent((prev) => !prev);
  };

  return (
    <Section>
      <ul>
        {cafeListArr.length !== 0 &&
          cafeListArr.map((value) => (
            <CafeListLi
              key={value.id}
              className={expandedId === value.id ? 'expanded' : ''}
            >
              <CafeTitleDiv>
                <div>
                  <span></span>
                  {value.name}
                </div>
                <button onClick={() => toggleExpand(value.id)}>
                  <img src={bottomArrow} alt="bottom arrow" />
                </button>
              </CafeTitleDiv>
              <>
                {switchContent ? (
                  <CafeCommentDiv>
                    {commentList.map((value) => (
                      <ul>
                        <li>
                          <p>{value.nickname}</p>
                          <p>{value.content}</p>
                        </li>
                      </ul>
                    ))}
                    <ToggleButton onClick={toggleContent}>
                      카페 정보
                    </ToggleButton>
                  </CafeCommentDiv>
                ) : (
                  <CafeInfoDiv>
                    <p>{value.description}</p>
                    <div>
                      <span>영업시간 | </span>
                      <ul>
                        <li>월 10 : 00 ~ 22 : 00</li>
                        <li>화 10 : 00 ~ 22 : 00</li>
                        <li>수 10 : 00 ~ 22 : 00</li>
                        <li>목 10 : 00 ~ 22 : 00</li>
                        <li>금 10 : 00 ~ 22 : 00</li>
                        <li>토 10 : 00 ~ 22 : 00</li>
                        <li>일 10 : 00 ~ 22 : 00</li>
                      </ul>
                    </div>
                    <p>카페 이벤트</p>
                    <p>카페 SNS URL</p>
                    <img src={sampleCafe} alt="" />

                    <ToggleButton onClick={toggleContent}>댓글</ToggleButton>
                  </CafeInfoDiv>
                )}
              </>
            </CafeListLi>
          ))}
      </ul>
    </Section>
  );
};

const Section = styled.section`
  li {
  }
`;
const CafeListLi = styled.li`
  border: 1px solid #9e9e9e;
  border-radius: 10px;
  overflow: hidden;
  max-height: 54px;
  transition: max-height 0.3s ease-in-out;
  margin: 10px 0;

  &.expanded {
    max-height: 500px; /* 충분히 큰 값으로 설정 (콘텐츠에 따라 자동 조정) */
  }
`;

const CafeTitleDiv = styled.div`
  padding: 14px 10px 14px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 54px;
  div {
    display: flex;
    align-items: center;
  }
  span {
    border-radius: 50%;
    background-color: #36c557;
    width: 8px;
    height: 8px;
    display: block;
    margin-right: 8px;
  }
  button {
    width: 14px;
    height: 14px;
    img {
      width: 100%;
    }
  }
`;

const CafeInfoDiv = styled.div`
  padding: 0 26px 14px 26px;
  p,
  div {
    margin-bottom: 5px;
    font-size: 12px;
  }
  div {
    display: flex;
    ul {
      margin-left: 5px;
      li {
        margin-bottom: 1px;
      }
    }
  }
  img {
    border-radius: 4px;
    width: 100%;
  }
`;

const CafeCommentDiv = styled.div`
  padding: 0 26px 14px 26px;
  ul {
    li {
      font-size: 12px;
      display: flex;
    }
  }
  p:first-child {
    margin-right: 10px;
  }
`;

const ToggleButton = styled.button`
  width: 100%;
  font-size: 12px;
  color: #384eda;
  display: block;
  text-align: right;
  margin-top: 10px;
`;

export default CafeList;
