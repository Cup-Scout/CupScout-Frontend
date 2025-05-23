import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAtom } from 'jotai';

import Maps from '../components/Maps';
import Search from '../components/Search';
import Category from '../components/Category';
import CafeList from '../components/CafeList';

import {
  getCafeListArr,
  getSelectedCategories,
  getExpandedId,
  getSelectedCafeHour,
  getTest,
  getSwitchContent,
  getTodayHours,
  getSelectedExpandedId,
} from '../atoms';

const CafeWrapper = () => {
  const [cafeListArr, setCafeListArr] = useAtom(getCafeListArr);
  const [selectedCategories, setSelectedCategories] = useAtom(
    getSelectedCategories,
  );
  const [expandedId, setExpandedId] = useAtom(getExpandedId);
  const [_, setSelectedCafeHour] = useAtom(getSelectedCafeHour);
  const [__, setTest] = useAtom(getTest);
  const [___, setSwitchContent] = useAtom(getSwitchContent);
  const [____, setTodayHours] = useAtom(getTodayHours);
  const [selectedExpandedId, setSelectedExpandedId] = useAtom(
    getSelectedExpandedId,
  );
  const location = useLocation();
  const navigate = useNavigate();

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

  const getOperatingStatus = async (data: any[]) => {
    const finalCafeInfo = await Promise.all(
      data.map(async (value: any) => {
        const { operatingHour } = await openStatus(value.id);

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

        //: 운영시간이 24시
        if (operatingHour.open_24h) {
          return {
            ...value,
            open_24h: operatingHour.open_24h,
            operation: '영업중',
          };
        } else {
          //: 운영시간 연중무휴 아님
          if (operatingHour.open && operatingHour.close) {
            //: 오늘 영업중인 곳
            if (
              Number(operatingHour.close.slice(0, 2)) <
              Number(operatingHour.open.slice(0, 2))
            ) {
              //: 운영시간이 새벽까지 인 곳
              if (day < 10) {
                formatDay = `0${day}`;
              } else {
                formatDay = day;
              }

              let closeFormatDay;
              if (day + 1 < 10) {
                closeFormatDay = `0${day + 1}`;
              } else {
                closeFormatDay = day + 1;
              }

              const openTime = new Date(
                `${year}-${formatMonth}-${formatDay}T${operatingHour.open}:00`,
              );

              const closeTime = new Date(
                `${year}-${formatMonth}-${closeFormatDay}T${operatingHour.close}:00`,
              );

              let closeTimeNumber: number | string = closeTime.getHours();
              if (closeTimeNumber < 10) {
                closeTimeNumber = `0${closeTimeNumber - 1}`;
              } else {
                closeTimeNumber = closeTimeNumber - 1;
              }
              const almostCloseTime = new Date(
                `${year}-${formatMonth}-${closeFormatDay}T${closeTimeNumber}:00`,
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
            } else {
              //: 운영시간이 24시전 끝나는 곳
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

              let closeTimeNumber = closeTime.getHours();

              if (closeTimeNumber === 0) {
                closeTimeNumber = 24;
              }

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
            }
          } else {
            //: 오늘 영업이 아닌 곳
            return {
              ...value,
              open_24h: null,
              operation: null,
            };
          }
        }
      }),
    );
    return finalCafeInfo;
  };

  const toggleExpand = async (id: number) => {
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
    if (typeof state === 'number') {
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
      setCafeListArr([]);
      return;
    }

    getCafesByCategories(selectedCategories);
  }, [selectedCategories]);

  return (
    <Main className="wrapper">
      <Search getOperatingStatus={getOperatingStatus} />
      <Category />
      <Maps selectedToggleExpand={selectedToggleExpand} />
      <CafeList
        cafeListArr={cafeListArr}
        expandedId={expandedId}
        toggleExpand={toggleExpand}
        selectedExpandedId={selectedExpandedId}
        selectedToggleExpand={selectedToggleExpand}
      />
    </Main>
  );
};

const Main = styled.main``;

export default CafeWrapper;
