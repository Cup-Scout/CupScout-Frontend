import { useState } from 'react';
import styled from 'styled-components';
import bottomArrow from '../assets/bottom-arrow.png';
import sampleCafe from '../assets/sampleCafe.png';

interface commentList {
  id: number;
  nickname: string;
  password: string;
  content: string;
  cafe_id: 1;
  created: string;
  deleted: 0;
  updated: string;
}

interface openingHours {
  event: null;
  id: number;
  name: string;
  open_24h: number | null;
  opening_hours: {
    monday: { open: null | number; close: null | number };
    tuesday: { open: null | number; close: null | number };
    wednesday: { open: null | number; close: null | number };
    thursday: { open: null | number; close: null | number };
    friday: { open: null | number; close: null | number };
    saturday: { open: null | number; close: null | number };
    sunday: { open: null | number; close: null | number };
  };
}

interface cafeInfoProps {
  value: any;
  expandedId: number | null;
  toggleExpand: (id: number) => void;
  switchContent: boolean;
  setSwitchContent: React.Dispatch<React.SetStateAction<boolean>>;
  todayHours: { open: string | null; close: string | null };
  test: boolean;
  setTest: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCafeHour: openingHours | null;
}

const CafeInfo = ({
  value,
  expandedId,
  toggleExpand,
  switchContent,
  setSwitchContent,
  todayHours,
  test,
  setTest,
  selectedCafeHour,
}: cafeInfoProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [commentList, setCommentList] = useState<commentList[]>([]);
  const weekDays = [
    { key: 'monday', label: '월' },
    { key: 'tuesday', label: '화' },
    { key: 'wednesday', label: '수' },
    { key: 'thursday', label: '목' },
    { key: 'friday', label: '금' },
    { key: 'saturday', label: '토' },
    { key: 'sunday', label: '일' },
  ];

  const getComment = async (id: number | null) => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_LOCAL_API_URL}/api/comments/${id}`,
    );
    const data = await response.json();
    setCommentList(data);
  };

  const commentDeleteToggle = () => {
    setIsVisible((prev) => !prev);
  };

  const toggleContent = async (id: number | null) => {
    setSwitchContent((prev: boolean) => !prev);
    if (id) getComment(id);
  };
  const openOperatingHours = () => {
    setTest((prev: boolean) => !prev);
  };

  return (
    <CafeListLi className={expandedId === value.id ? 'expanded' : ''}>
      <CafeTitleDiv operation={value.operation}>
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
          <CafeCommentDiv visible={isVisible ? 1 : 0}>
            {commentList.length ? (
              <ul className="comment-list">
                {commentList.map((v) => (
                  <li key={v.id} onClick={() => commentDeleteToggle()}>
                    <div>
                      <p>{v.nickname}</p>
                      <p>{v.content}</p>
                      <p>{v.created.slice(0, 10)}</p>
                    </div>
                    <div className="delete-comment-field">
                      <input
                        type="password"
                        placeholder="비밀번호를 입력하면 삭제됩니다"
                      />
                      <button>삭제</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div>댓글 없음</div>
            )}
            <Pagination>
              <ul>
                <li className="selected">
                  <button>1</button>
                </li>
                <li>
                  <button>2</button>
                </li>
                <li>
                  <button>3</button>
                </li>
              </ul>
            </Pagination>
            <CreationComment>
              <div className="data-entry-field">
                <div className="inputs">
                  <input type="text" name="nickname" placeholder="닉네임" />
                  <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                  />
                </div>
                <textarea
                  placeholder="댓글을 입력하세요"
                  rows={3}
                  maxLength={45}
                />
              </div>
              <button>등록</button>
            </CreationComment>
            <ToggleButton onClick={() => toggleContent(null)}>
              카페 정보
            </ToggleButton>
          </CafeCommentDiv>
        ) : (
          <CafeInfoDiv>
            <p>{value.description}</p>
            <div>
              <span onClick={openOperatingHours}>
                영업시간 | {todayHours.open ?? '휴무'} ~{' '}
                {todayHours.close ?? '휴무'}
                <img src={bottomArrow} alt="모든 영업시간 확인하기" />
              </span>
              <ul
                className={`hours-list ${test && expandedId === value.id ? 'open' : ''}`}
              >
                {weekDays.map(({ key, label }) => {
                  const dayData =
                    selectedCafeHour?.opening_hours[
                      key as keyof openingHours['opening_hours']
                    ];
                  return (
                    <li key={key}>
                      {label} {dayData?.open ?? '휴무'} ~{' '}
                      {dayData?.close ?? '휴무'}
                    </li>
                  );
                })}
              </ul>
            </div>
            <img src={sampleCafe} alt="" />

            <ToggleButton onClick={() => toggleContent(value.id)}>
              댓글
            </ToggleButton>
          </CafeInfoDiv>
        )}
      </>
    </CafeListLi>
  );
};

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

const CafeInfoDiv = styled.div`
  padding: 0 26px 14px 26px;
  p,
  div {
    margin-bottom: 5px;
    font-size: 12px;
  }
  div {
    span {
      cursor: pointer;
      img {
        width: 8px;
        margin-left: 5px;
      }
    }
    ul {
      margin-top: 5px;
      overflow: hidden;
      transition: height 0.3s ease;
      li {
        margin-bottom: 1px;
      }
    }
    ul.hours-list {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-in-out;
    }

    ul.hours-list.open {
      max-height: 200px; // 충분히 큰 값으로 설정 (초과해도 자동 스크롤됨)
    }
  }
  img {
    border-radius: 4px;
    width: 100%;
  }
`;

const CreationComment = styled.section`
  .data-entry-field {
    margin-top: 10px;
    display: flex;
    align-items: stretch; /* 중요: 두 열의 높이를 맞추기 위해 */
  }
  .inputs {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%; /* stretch와 함께 사용하면 전체 높이 채움 */
    margin-right: 5px;
  }
  input {
    width: 60px;
    font-size: 8px;
    padding: 5px;
    box-sizing: border-box;
    flex: 1; /* 동일한 높이로 나눔 */
    border-radius: 4px;
    border: 1px solid #9e9e9e;
    text-align: center;
  }
  input:first-child {
    margin-bottom: 5px;
  }
  textarea {
    resize: none;
    width: 100%;
    padding: 5px;
    font-size: 10px;
    overflow-y: hidden;
    border: 1px solid #9e9e9e;
    border-radius: 4px;
  }
  button {
    margin: 0 auto;
    width: 28px;
    padding: 4px 0;
    background-color: #384eda;
    border-radius: 12px;
    font-size: 8px;
    color: #fff;
    display: block;
    margin: 8px auto;
  }
`;

const CafeCommentDiv = styled.div<{ visible: number }>`
  padding: 0 26px 14px 26px;
  ul.comment-list {
    height: 180px;
    li {
      div:first-child {
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
        cursor: pointer;
        p:nth-of-type(2) {
          text-align: left;
          flex: 1;
        }
      }
      div:last-child {
        display: ${({ visible }) => (visible ? 'block' : 'none')};
        align-items: stretch;
        justify-content: right;
        margin-bottom: 20px;
        transition: all 0.3s;

        input {
          height: 14px;
          font-size: 8px;
          padding-left: 6px;
          width: 120px;
          border-radius: 12px;
          border: 1px solid #9e9e9e;
          color: #9e9e9e;
        }
        button {
          width: 28px;
          line-height: 14px;
          background-color: #384eda;
          border-radius: 12px;
          font-size: 8px;
          color: #fff;
          margin-left: 4px;
        }
      }
    }
  }
  p:first-child {
    margin-right: 10px;
    width: 56px;
  }
  p:last-child {
    margin-left: 5px;
    width: 50px;
    font-size: 8px;
    color: #9e9e9e;
  }
  div {
    font-size: 12px;
  }
  .delete-comment-field {
    display: flex;
  }
`;

const CafeTitleDiv = styled.div<{ operation: string }>`
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
    background-color: ${({ operation }) =>
      operation === '영업중'
        ? '#36c557'
        : operation === '곧 영업종료'
          ? '#D24040'
          : '#828689'};
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

const Pagination = styled.section`
  ul {
    display: flex;
    justify-content: center;
    li {
      margin-right: 6px;
      button {
        font-size: 8px;
        color: #9e9e9e;
        &:active {
          color: #9e076c;
        }
      }
    }
    li:last-child {
      margin-right: 0;
    }
    li.selected {
      button {
        color: #9e076c;
      }
    }
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

export default CafeInfo;
