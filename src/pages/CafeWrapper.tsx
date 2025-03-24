import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Maps from '../components/Maps';
import Search from '../components/Search';
import Category from '../components/Category';
import CafeList from '../components/CafeList';
import styled from 'styled-components';

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

const CafeWrapper = () => {
  const [cafeListArr, setCafeListArr] = useState<cafeInfo[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(
    new Set(),
  );
  const location = useLocation();
  const navigate = useNavigate();

  const getAllCafeList = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_LOCAL_API_URL}/api/cafes`,
    );
    const data = await response.json();
    //* cafeList 변경됨
    setCafeListArr(data);
  };

  const getCafesByCategories = async (categorySet: Set<number>) => {
    console.log(categorySet);
    const responses = await Promise.all(
      [...categorySet].map((id) =>
        fetch(
          `${import.meta.env.VITE_APP_LOCAL_API_URL}/api/categories/${id}/cafes`,
        ).then((res) => res.json()),
      ),
    );

    const merged = Array.from(
      new Set(responses.flat().map((item) => JSON.stringify(item))),
    ).map((item) => JSON.parse(item));

    //* cafeList 변경됨
    setCafeListArr(merged);
  };

  //: 초기 진입 시 한 번만 실행
  useEffect(() => {
    const state = location.state;
    if (state === 999) {
      getAllCafeList();
    } else if (typeof state === 'number') {
      const newSet = new Set<number>();
      newSet.add(state);
      //: Set 자료구조로 만들어진 category에 저장
      setSelectedCategories(newSet);
      //: 만들어진 자료구조를 인자로 넘겨서 해당 카테고리 리스트 불러오기
      getCafesByCategories(newSet);
    }

    navigate(location.pathname, { replace: true });
  }, []);

  //* 핵심은 category가 변경되면 cafe list 갱신을 이곳에서 해주는 것.
  //: 카테고리 상태 변경 시마다 리스트 갱신
  useEffect(() => {
    //: 아무것도 선택 안했을 경우 무시
    if (selectedCategories.size === 0) {
      getAllCafeList();
      return;
    }

    getCafesByCategories(selectedCategories);
  }, [selectedCategories]);

  return (
    <Main className="wrapper">
      <Search setCafeListArr={setCafeListArr} />
      <Category
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      <Maps cafeListArr={cafeListArr} />
      <CafeList cafeListArr={cafeListArr} />
    </Main>
  );
};

const Main = styled.main``;

export default CafeWrapper;
