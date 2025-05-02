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

interface todayHours {
  open: string | null;
  close: string | null;
}

const CafeWrapper = () => {
  const [cafeListArr, setCafeListArr] = useState<cafeInfo[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(
    new Set(),
  );
  const [selectedCafe, setSelectedCafe] = useState<cafeInfo | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedCafeHour, setSelectedCafeHour] = useState<openingHours | null>(
    null,
  );
  const [test, setTest] = useState<boolean>(false);
  const [switchContent, setSwitchContent] = useState(false);

  const [todayHours, setTodayHours] = useState<todayHours>({
    open: null,
    close: null,
  });

  const [selectedExpandedId, setSelectedExpandedId] = useState<number | null>(
    null,
  );

  const openStatus = async (id: number) => {
    const today = new Date();
    const day = today.getDay();
    const dayOfWeek = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ][day];

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_LOCAL_API_URL}/api/cafes/${id}/hours/${dayOfWeek}`,
      );

      if (!response.ok) return { dayOfWeek, operatingHour: null };

      const operatingHour = await response.json();
      return { dayOfWeek, operatingHour };
    } catch (e) {
      console.error(`Failed to fetch cafe hours for id ${id}:`, e);
      return { dayOfWeek, operatingHour: null };
    }
  };

  const getOperatingStatus = async (data: any) => {
    const finalCafeInfo = await Promise.all(
      data.map(async (value: any) => {
        const { operatingHour } = await openStatus(value.id);
        if (!operatingHour) {
          return {
            ...value,
            open_24h: null,
            operation: null,
          };
        }

        const today: Date = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();

        let formatMonth;
        let formatDay;

        if (month + 1 < 10) {
          formatMonth = `0${month + 1}`;
        } else {
          formatMonth = `${month + 1}`;
        }

        if (day < 10) {
          formatDay = `0${day}`;
        } else {
          formatDay = day;
        }

        const openTime = new Date(
          `${year}-${formatMonth}-${formatDay}T${operatingHour.open}:00`,
        );

        const closeTime = new Date(
          `${year}-${formatMonth}-${formatDay}T${operatingHour.close}:00`,
        );

        const closeTimeNumber = closeTime.getHours();

        const almostCloseTime = new Date(
          `${year}-${formatMonth}-${formatDay}T${closeTimeNumber - 1}:00`,
        );
        let isOperating: string;

        if (today >= openTime && today < almostCloseTime) {
          isOperating = '영업중';
        } else if (today >= almostCloseTime && today < closeTime) {
          isOperating = '곧 영업종료';
        } else {
          isOperating = '영업종료';
        }

        return {
          ...value,
          open_24h: operatingHour.open_24h,
          operation: isOperating,
        };
      }),
    );
    return finalCafeInfo;
  };

  const getAllCafeList = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_LOCAL_API_URL}/api/cafes`,
    );
    const data = await response.json();
    //* cafeList 변경됨

    const finalCafeInfo = await getOperatingStatus(data);
    setCafeListArr(finalCafeInfo);
  };

  const toggleExpand = async (id: number) => {
    // setSelectedExpandedId(null);
    if (expandedId === id) {
      setExpandedId(null); //* 클릭한 항목이 이미 열려 있으면 닫기
      setTest(false);
      setSwitchContent(false);
    } else {
      setExpandedId(null); //* 기존에 열려 있던 항목을 즉시 닫기
      setTest(false);
      setExpandedId(id);
      const response = await fetch(
        `${import.meta.env.VITE_APP_LOCAL_API_URL}/api/cafes/${id}/hours`,
      );
      const data = await response.json();
      const today = new Date().getDay();
      const dayOfWeek = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ][today];

      const todayOpen = data.opening_hours[dayOfWeek].open;
      const todayClose = data.opening_hours[dayOfWeek].close;
      setTodayHours({ open: todayOpen, close: todayClose });
      setSelectedCafeHour(data);
      setSwitchContent(false);
    }
  };

  const selectedToggleExpand = async (id: number) => {
    // setExpandedId(null);
    if (selectedExpandedId === id) {
      setSelectedExpandedId(null); //* 클릭한 항목이 이미 열려 있으면 닫기
      setTest(false);
      setSwitchContent(false);
    } else {
      setSelectedExpandedId(null); //* 기존에 열려 있던 항목을 즉시 닫기
      setTest(false);
      setSelectedExpandedId(id);
      const response = await fetch(
        `${import.meta.env.VITE_APP_LOCAL_API_URL}/api/cafes/${id}/hours`,
      );
      const data = await response.json();
      const today = new Date().getDay();
      const dayOfWeek = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ][today];

      const todayOpen = data.opening_hours[dayOfWeek].open;
      const todayClose = data.opening_hours[dayOfWeek].close;
      setTodayHours({ open: todayOpen, close: todayClose });
      setSelectedCafeHour(data);
      setSwitchContent(false);
    }
  };

  const getCafesByCategories = async (categorySet: Set<number>) => {
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
    const finalCafeInfo = await getOperatingStatus(merged);
    //* cafeList 변경됨
    setCafeListArr(finalCafeInfo);
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
      <Search
        setCafeListArr={setCafeListArr}
        getOperatingStatus={getOperatingStatus}
      />
      <Category
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      <Maps
        cafeListArr={cafeListArr}
        setSelectedCafe={setSelectedCafe}
        selectedToggleExpand={selectedToggleExpand}
        setSwitchContent={setSwitchContent}
      />
      <CafeList
        cafeListArr={cafeListArr}
        selectedCafe={selectedCafe}
        toggleExpand={toggleExpand}
        selectedCafeHour={selectedCafeHour}
        expandedId={expandedId}
        todayHours={todayHours}
        test={test}
        setTest={setTest}
        setSwitchContent={setSwitchContent}
        switchContent={switchContent}
        selectedExpandedId={selectedExpandedId}
        selectedToggleExpand={selectedToggleExpand}
      />
    </Main>
  );
};

const Main = styled.main``;

export default CafeWrapper;
