import { useEffect, useState } from 'react';
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

interface categoryInfo {
  category: string;
  created: string;
  description: string;
  id: number;
  updated: string;
}

const CafeWrapper = () => {
  const [cafeListArr, setCafeListArr] = useState<cafeInfo[]>([]);
  const [categoryListArr, setCategoryListArr] = useState<categoryInfo[]>([]);

  const getCafeList = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_LOCAL_API_URL}/api/cafes`,
    );
    const cafeList = await response.json();
    setCafeListArr(cafeList);
  };

  const getCategory = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_LOCAL_API_URL}/api/categories`,
    );
    const categoryList = await response.json();
    setCategoryListArr(categoryList);
  };

  useEffect(() => {
    getCafeList();
    getCategory();
  }, []);

  return (
    <Main className="wrapper">
      <Search />
      <Category categoryListArr={categoryListArr} />
      <Maps />
      <CafeList cafeListArr={cafeListArr} />
    </Main>
  );
};

const Main = styled.main`
  /* padding: 10px; */
`;

export default CafeWrapper;
