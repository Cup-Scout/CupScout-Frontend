import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import bottomArrow from '../assets/bottom-arrow.png';
import sampleCafe from '../assets/sampleCafe.png';
import LoadingState from './LoadingState';

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

interface openingHours {
  event: null;
  id: number;
  name: string;
  open_24h: null;
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

interface cafeListArrProps {
  cafeListArr: cafeInfo[];
  selectedCafe: cafeInfo | null;
  toggleExpand: (id: number) => void;
  selectedCafeHour: openingHours | null;
  expandedId: number | null;
}

interface commentList {
  id: number;
  nickname: string;
  password: string;
  content: string;
}

const CafeList = ({
  cafeListArr,
  selectedCafe,
  toggleExpand,
  selectedCafeHour,
  expandedId,
}: cafeListArrProps) => {
  const [switchContent, setSwitchContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(0);

  const pageList = 6;

  const [cafeList, setCafeList] = useState<cafeInfo[]>([]);

  const target = useRef<HTMLDivElement | null>(null);

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

  const toggleContent = async () => {
    setSwitchContent((prev) => !prev);
  };

  const callback = () => {
    if (loading) return;
    if (cafeList.length >= cafeListArr.length) return; // 여기도 setPage(0) 말고 그냥 return
    setLoading(true);
    setTimeout(() => {
      const start = page * pageList;
      const end = start + pageList;
      const nextList = cafeListArr.slice(start, end);
      setCafeList((prev) => [...prev, ...nextList]);
      setPage((prev) => prev + 1);
      setLoading(false);
    }, 500);
  };

  // const observer = new IntersectionObserver((entries, _observer) => {
  //   if (entries[0].isIntersecting) {
  //     callback();
  //   }
  // });

  // useEffect(() => {
  //   if (target.current) {
  //     observer.observe(target.current);
  //   }
  //   return () => {
  //     observer.disconnect();
  //   };
  // }, [page, cafeListArr]);

  useEffect(() => {
    if (!target.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback();
      }
    });

    observer.observe(target.current);

    return () => {
      observer.disconnect();
    };
  }, [callback, cafeListArr]); // 또는 그냥 []로 한 번만 생성해도 됨

  useEffect(() => {
    //: cafeListArr가 바뀔 때마다 초기화
    if (cafeListArr.length < 7) {
      setCafeList(cafeListArr);
      setPage(1); // 1페이지만 보여주면 됨
      return;
    }
    const slicedCafeList = cafeListArr.slice(0, pageList);
    setCafeList(slicedCafeList);
    setPage(1); // 다시 1로 시작
  }, [cafeListArr]);

  //! 각 카페별 댓글 버튼을 누르면 그 카페에 대한 댓글 api 호출

  return (
    <Section>
      {selectedCafe && (
        <SelectedCafeWrapper>
          <SelectedCafeDiv
            className={expandedId === selectedCafe.id ? 'expanded' : ''}
          >
            <CafeTitleDiv>
              <div>
                <span></span>
                {selectedCafe.name}
              </div>
              <button onClick={() => toggleExpand(selectedCafe.id)}>
                <img src={bottomArrow} alt="bottom arrow" />
              </button>
            </CafeTitleDiv>
            <>
              {switchContent ? (
                <CafeCommentDiv>
                  {commentList ? (
                    <ul>
                      {commentList.map((v) => (
                        <li key={v.id}>
                          <p>{v.nickname}</p>
                          <p>{v.content}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>댓글 없음</div>
                  )}

                  <ToggleButton onClick={toggleContent}>카페 정보</ToggleButton>
                </CafeCommentDiv>
              ) : (
                <CafeInfoDiv>
                  <p>{selectedCafe.description}</p>
                  <div>
                    <span>영업시간 | </span>
                    <ul>
                      <li>
                        월{' '}
                        {`${selectedCafeHour?.opening_hours.tuesday.open ? selectedCafeHour?.opening_hours.tuesday.open : '정보 없음'} 
                          ~ ${selectedCafeHour?.opening_hours.tuesday.close ? selectedCafeHour?.opening_hours.tuesday.open : '정보 없음'}`}
                      </li>
                      <li>
                        화{' '}
                        {`${selectedCafeHour?.opening_hours.wednesday.open ? selectedCafeHour?.opening_hours.wednesday.open : '정보 없음'} 
                          ~ ${selectedCafeHour?.opening_hours.wednesday.close ? selectedCafeHour?.opening_hours.wednesday.open : '정보 없음'}`}
                      </li>
                      <li>
                        수{' '}
                        {`${selectedCafeHour?.opening_hours.thursday.open ? selectedCafeHour?.opening_hours.thursday.open : '정보 없음'} 
                          ~ ${selectedCafeHour?.opening_hours.thursday.close ? selectedCafeHour?.opening_hours.thursday.open : '정보 없음'}`}
                      </li>
                      <li>
                        목{' '}
                        {`${selectedCafeHour?.opening_hours.friday.open ? selectedCafeHour?.opening_hours.friday.open : '정보 없음'} 
                          ~ ${selectedCafeHour?.opening_hours.friday.close ? selectedCafeHour?.opening_hours.friday.open : '정보 없음'}`}
                      </li>
                      <li>
                        금{' '}
                        {`${selectedCafeHour?.opening_hours.saturday.open ? selectedCafeHour?.opening_hours.saturday.open : '정보 없음'} 
                          ~ ${selectedCafeHour?.opening_hours.saturday.close ? selectedCafeHour?.opening_hours.saturday.open : '정보 없음'}`}
                      </li>
                      <li>
                        토{' '}
                        {`${selectedCafeHour?.opening_hours.monday.open ? selectedCafeHour?.opening_hours.monday.open : '정보 없음'} 
                          ~ ${selectedCafeHour?.opening_hours.monday.close ? selectedCafeHour?.opening_hours.monday.open : '정보 없음'}`}
                      </li>
                      <li>
                        일{' '}
                        {`${selectedCafeHour?.opening_hours.sunday.open ? selectedCafeHour?.opening_hours.sunday.open : '정보 없음'} 
                          ~ ${selectedCafeHour?.opening_hours.sunday.close ? selectedCafeHour?.opening_hours.sunday.open : '정보 없음'}`}
                      </li>
                    </ul>
                  </div>
                  <img src={sampleCafe} alt="" />

                  <ToggleButton onClick={toggleContent}>댓글</ToggleButton>
                </CafeInfoDiv>
              )}
            </>
          </SelectedCafeDiv>
        </SelectedCafeWrapper>
      )}

      <ul>
        {cafeList.length !== 0 &&
          cafeList.map((value) => (
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
                    {commentList ? (
                      <ul>
                        {commentList.map((v) => (
                          <li key={v.id}>
                            <p>{v.nickname}</p>
                            <p>{v.content}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div>댓글 없음</div>
                    )}

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
                        <li>
                          월{' '}
                          {`${selectedCafeHour?.opening_hours.tuesday.open ? selectedCafeHour?.opening_hours.tuesday.open : '정보 없음'} 
                          ~ ${selectedCafeHour?.opening_hours.tuesday.close ? selectedCafeHour?.opening_hours.tuesday.open : '정보 없음'}`}
                        </li>
                        <li>
                          화{' '}
                          {`${selectedCafeHour?.opening_hours.wednesday.open ? selectedCafeHour?.opening_hours.wednesday.open : '정보 없음'} 
                          ~ ${selectedCafeHour?.opening_hours.wednesday.close ? selectedCafeHour?.opening_hours.wednesday.open : '정보 없음'}`}
                        </li>
                        <li>
                          수{' '}
                          {`${selectedCafeHour?.opening_hours.thursday.open ? selectedCafeHour?.opening_hours.thursday.open : '정보 없음'} 
                          ~ ${selectedCafeHour?.opening_hours.thursday.close ? selectedCafeHour?.opening_hours.thursday.open : '정보 없음'}`}
                        </li>
                        <li>
                          목{' '}
                          {`${selectedCafeHour?.opening_hours.friday.open ? selectedCafeHour?.opening_hours.friday.open : '정보 없음'} 
                          ~ ${selectedCafeHour?.opening_hours.friday.close ? selectedCafeHour?.opening_hours.friday.open : '정보 없음'}`}
                        </li>
                        <li>
                          금{' '}
                          {`${selectedCafeHour?.opening_hours.saturday.open ? selectedCafeHour?.opening_hours.saturday.open : '정보 없음'} 
                          ~ ${selectedCafeHour?.opening_hours.saturday.close ? selectedCafeHour?.opening_hours.saturday.open : '정보 없음'}`}
                        </li>
                        <li>
                          토{' '}
                          {`${selectedCafeHour?.opening_hours.monday.open ? selectedCafeHour?.opening_hours.monday.open : '정보 없음'} 
                          ~ ${selectedCafeHour?.opening_hours.monday.close ? selectedCafeHour?.opening_hours.monday.open : '정보 없음'}`}
                        </li>
                        <li>
                          일{' '}
                          {`${selectedCafeHour?.opening_hours.sunday.open ? selectedCafeHour?.opening_hours.sunday.open : '정보 없음'} 
                          ~ ${selectedCafeHour?.opening_hours.sunday.close ? selectedCafeHour?.opening_hours.sunday.open : '정보 없음'}`}
                        </li>
                      </ul>
                    </div>
                    <img src={sampleCafe} alt="" />

                    <ToggleButton onClick={toggleContent}>댓글</ToggleButton>
                  </CafeInfoDiv>
                )}
              </>
            </CafeListLi>
          ))}
        {cafeList.length < cafeListArr.length && (
          <div
            style={{ height: '10px', backgroundColor: 'red' }}
            ref={target}
          ></div>
        )}
        {loading && <LoadingState />}
      </ul>
    </Section>
  );
};

const Section = styled.section`
  overflow: hidden;
  /* height: 420px; */
  margin-top: 10px;
  ul {
    /* height: 100%; */
    max-height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  li {
  }
`;
const SelectedCafeWrapper = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid #9e9e9e;
`;

const SelectedCafeDiv = styled.div`
  border: 1px solid #9e076c;
  border-radius: 10px;
  overflow: hidden;
  max-height: 54px;
  transition: max-height 0.3s ease-in-out;

  &.expanded {
    max-height: 500px; /* 충분히 큰 값으로 설정 (콘텐츠에 따라 자동 조정) */
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
