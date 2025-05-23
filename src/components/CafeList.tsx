import { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import LoadingState from './LoadingState';
import CafeInfo from './CafeInfo';

import { useAtom } from 'jotai';
import { getSelectedCafe } from '../atoms';

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

interface cafeListArrProps {
  cafeListArr: cafeInfo[];
  expandedId: number | null;
  toggleExpand: (id: number) => void;
  selectedExpandedId: number | null;
  selectedToggleExpand: (id: number) => void;
}

const CafeList = ({
  cafeListArr,
  expandedId,
  toggleExpand,
  selectedExpandedId,
  selectedToggleExpand,
}: cafeListArrProps) => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [cafeList, setCafeList] = useState<cafeInfo[]>([]);
  const [selectedCafe, _] = useAtom(getSelectedCafe);

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
            selectedExpandedId={selectedExpandedId}
            selectedToggleExpand={selectedToggleExpand}
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
  border-bottom: 1px solid #e6e6e6;
`;

export default CafeList;
