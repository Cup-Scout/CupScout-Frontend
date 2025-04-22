import { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import LoadingState from './LoadingState';
import CafeInfo from './CafeInfo';

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
  open_24h: number | null;
  operation: string;
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

interface cafeListArrProps {
  cafeListArr: cafeInfo[];
  selectedCafe: cafeInfo | null;
  toggleExpand: (id: number) => void;
  selectedCafeHour: openingHours | null;
  expandedId: number | null;
  todayHours: { open: string | null; close: string | null };
  test: boolean;
  setTest: React.Dispatch<React.SetStateAction<boolean>>;
  switchContent: boolean;
  setSwitchContent: React.Dispatch<React.SetStateAction<boolean>>;
}

const CafeList = ({
  cafeListArr,
  selectedCafe,
  toggleExpand,
  selectedCafeHour,
  expandedId,
  todayHours,
  test,
  setTest,
  switchContent,
  setSwitchContent,
}: cafeListArrProps) => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [cafeList, setCafeList] = useState<cafeInfo[]>([]);

  const pageList = 6;

  const target = useRef<HTMLDivElement | null>(null);

  const callback = useCallback(() => {
    if (loading) return;
    if (cafeList.length >= cafeListArr.length) return;
    setLoading(true);
    setTimeout(() => {
      const start = page * pageList;
      const end = start + pageList;
      const nextList = cafeListArr.slice(start, end);
      setCafeList((prev) => [...prev, ...nextList]);
      setPage((prev) => prev + 1);
      setLoading(false);
    }, 500);
  }, [loading, cafeList, cafeListArr, page]);

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
  }, [callback]);

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
  //! selectedCafe toggleExpand 나누기

  return (
    <Section>
      {selectedCafe && (
        <SelectedCafeWrapper>
          <CafeInfo
            value={selectedCafe}
            expandedId={expandedId}
            toggleExpand={toggleExpand}
            switchContent={switchContent}
            todayHours={todayHours}
            test={test}
            setTest={setTest}
            setSwitchContent={setSwitchContent}
            selectedCafeHour={selectedCafeHour}
          />
        </SelectedCafeWrapper>
      )}

      <ul>
        {cafeList.length !== 0 &&
          cafeList.map((value) => (
            <CafeInfo
              key={value.id}
              value={value}
              expandedId={expandedId}
              toggleExpand={toggleExpand}
              switchContent={switchContent}
              todayHours={todayHours}
              test={test}
              setTest={setTest}
              setSwitchContent={setSwitchContent}
              selectedCafeHour={selectedCafeHour}
            />
          ))}
        {cafeList.length < cafeListArr.length && (
          <div style={{ height: '10px' }} ref={target}></div>
        )}
        {loading && <LoadingState />}
      </ul>
    </Section>
  );
};

const Section = styled.section`
  overflow: hidden;
  margin-top: 10px;
  ul {
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

export default CafeList;
