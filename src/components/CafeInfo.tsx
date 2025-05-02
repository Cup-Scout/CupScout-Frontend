import { useState, useRef } from 'react';
import styled from 'styled-components';
import bottomArrow from '../assets/bottom-arrow.png';
import sampleCafe from '../assets/sampleCafe.png';
import useDebounce from '../hooks/useDebounce';

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
  expandedId?: number | null;
  toggleExpand?: (id: number) => void;
  switchContent: boolean;
  setSwitchContent: React.Dispatch<React.SetStateAction<boolean>>;
  todayHours: { open: string | null; close: string | null };
  test: boolean;
  setTest: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCafeHour: openingHours | null;

  selectedExpandedId?: number | null;
  selectedToggleExpand?: (id: number) => void;
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
  selectedExpandedId,
  selectedToggleExpand,
}: cafeInfoProps) => {
  const [deletedId, setDeletedId] = useState<number | null>(null);
  const [commentList, setCommentList] = useState<commentList[]>([]);
  const [createCommentValues, setCreateCommentValues] = useState({
    nickname: '',
    password: '',
    content: '',
  });
  const passwordInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const weekDays = [
    { key: 'monday', label: '월' },
    { key: 'tuesday', label: '화' },
    { key: 'wednesday', label: '수' },
    { key: 'thursday', label: '목' },
    { key: 'friday', label: '금' },
    { key: 'saturday', label: '토' },
    { key: 'sunday', label: '일' },
  ];

  const isExpanded = expandedId === value.id;
  const isSelectedExpanded = selectedExpandedId === value.id;

  const handleClick = () => {
    if (toggleExpand) toggleExpand(value.id);
    if (selectedToggleExpand) selectedToggleExpand(value.id);
  };

  const getComment = async (id: number | null) => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_LOCAL_API_URL}/api/comments/${id}`,
    );
    const data = await response.json();
    setCommentList(data);
  };

  const commentDeleteToggle = (id: number) => {
    if (deletedId === id) {
      setDeletedId(null);
    } else {
      setDeletedId(id);
    }
  };

  const toggleContent = async (id: number | null) => {
    setSwitchContent((prev: boolean) => !prev);
    if (id) getComment(id);
  };
  const openOperatingHours = () => {
    setTest((prev: boolean) => !prev);
  };

  const deleteComment = async (id: number) => {
    try {
      const password = passwordInputRefs.current[id]?.value;
      if (!password) {
        alert('비밀번호를 입력해주세요.');
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_APP_LOCAL_API_URL}/api/comments/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: password }),
        },
      );
      const data = await response.json();
      if (data.success) {
        //: value.id = 카페 id
        //: id = 댓글 id
        await getComment(value.id);
        alert(data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        console.log(error.message);
      } else {
        console.log('알 수 없는 오류', error);
      }
    }
  };

  const onChangeComment = (value: string, keyName: string) => {
    setCreateCommentValues({ ...createCommentValues, [keyName]: value });
  };

  const query = useDebounce(createCommentValues, 500);

  const fetchComment = async () => {
    if (query.nickname === '' || query.password === '' || query.content === '')
      return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_LOCAL_API_URL}/api/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cafeId: value.id,
            nickname: query.nickname,
            password: query.password,
            content: query.content,
          }),
        },
      );
      const data = await response.json();
      //: error가 발생했을 때 (success:false)
      if (!response.ok) {
        throw new Error(data.message);
      }
      //: fetch 성공했을 때 (success:true)
      if (data.success) {
        await getComment(value.id);
        alert(data.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        console.log(error.message);
      } else {
        console.log('알 수 없는 오류', error);
      }
    }
    setCreateCommentValues({
      nickname: '',
      password: '',
      content: '',
    });
  };

  return (
    <CafeListLi
      className={
        expandedId !== undefined
          ? isExpanded
            ? 'expanded'
            : ''
          : isSelectedExpanded
            ? 'expanded'
            : ''
      }
    >
      <CafeTitleDiv operation={value.operation}>
        <div>
          <span></span>
          {value.name}
        </div>
        <button onClick={() => handleClick()}>
          <img src={bottomArrow} alt="bottom arrow" />
        </button>
      </CafeTitleDiv>
      <>
        {switchContent ? (
          <CafeCommentDiv>
            {commentList.length ? (
              <ul className="comment-list">
                {commentList.map((v) => (
                  <li key={v.id}>
                    <div onClick={() => commentDeleteToggle(v.id)}>
                      <p>{v.nickname}</p>
                      <p>{v.content}</p>
                      <p>{v.created.slice(0, 10)}</p>
                    </div>
                    <div
                      className={`${deletedId === v.id ? 'delete-comment-field' : 'delete-comment-field-hidden'}`}
                    >
                      <input
                        type="password"
                        placeholder="비밀번호를 입력하면 삭제됩니다."
                        ref={(el) => {
                          passwordInputRefs.current[v.id] = el;
                        }}
                      />
                      <button onClick={() => deleteComment(v.id)}>삭제</button>
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
                  <input
                    type="text"
                    name="nickname"
                    placeholder="닉네임"
                    value={createCommentValues.nickname}
                    onChange={(e) =>
                      onChangeComment(e.target.value, 'nickname')
                    }
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={createCommentValues.password}
                    onChange={(e) =>
                      onChangeComment(e.target.value, 'password')
                    }
                  />
                </div>
                <textarea
                  placeholder="댓글을 입력하세요"
                  rows={3}
                  maxLength={45}
                  value={createCommentValues.content}
                  onChange={(e) => onChangeComment(e.target.value, 'content')}
                />
              </div>
              <button onClick={fetchComment}>등록</button>
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
  list-style: none;
  &.expanded {
    max-height: 500px; /* 충분히 큰 값으로 설정 (콘텐츠에 따라 자동 조정) */
  }
`;

const CafeInfoDiv = styled.div`
  padding: 0 14px 14px 14px;
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
    /* display: flex; */
    align-items: stretch; /* 중요: 두 열의 높이를 맞추기 위해 */
  }
  .inputs {
    display: flex;
    height: 100%; /* stretch와 함께 사용하면 전체 높이 채움 */
    gap: 8px;
    transform: scale(0.75);
    transform-origin: top left;
    width: calc(100% / 0.75); /* 스케일 보정 */
    margin-bottom: -4px;
  }
  input {
    flex: 1;
    font-size: 16px;
    padding: 6.67px;
    box-sizing: border-box;
    border-radius: 5.33px;
    border: 1px solid #9e9e9e;
    text-align: center;
  }
  input:first-child {
  }
  textarea {
    resize: none;
    width: calc(100% / 0.75);
    padding: calc(5px / 0.75); /* 약 6.67px */
    font-size: 16px; /* 줌 방지용 */
    overflow-y: hidden;
    border: 1px solid #9e9e9e;
    border-radius: calc(4px / 0.75); /* 약 5.33px */
    margin-bottom: -16px;

    transform: scale(0.75);
    transform-origin: top left;
  }
  button {
    margin: 0 auto;
    width: 40px;
    padding: 6px 0;
    background-color: #384eda;
    border-radius: 12px;
    font-size: 10px;
    color: #fff;
    display: block;
    margin: 8px auto;
  }
`;

const CafeCommentDiv = styled.div`
  padding: 0 14px 14px 14px;
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
        align-items: stretch;
        justify-content: right;
        margin-bottom: 20px;
        transition: all 0.3s;

        input {
          height: 20px;
          font-size: 11px;
          padding-left: 10px;
          width: 200px;
          border-radius: 12px;
          border: 1px solid #9e9e9e;
          color: #9e9e9e;
        }
        button {
          width: 30px;
          line-height: 16px;
          background-color: #384eda;
          border-radius: 12px;
          font-size: 10px;
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
    font-size: 9px;
    color: #9e9e9e;
  }
  div {
    font-size: 12px;
  }
  .delete-comment-field {
    display: flex;
  }
  .delete-comment-field-hidden {
    display: none;
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
        font-size: 10px;
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
