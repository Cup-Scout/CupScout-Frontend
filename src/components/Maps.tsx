import { useEffect, useRef } from 'react';

interface cafeInfo {
  id: number;
  name: string;
  address_doro: string;
  lat: number;
  lng: number;
  description: string;
  categories: string;
  visible: number;
  deleted: number;
  created: string;
  updated: string;
}

const Maps = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  //! 임시 position
  const cafePosition = [
    {
      id: 1,
      name: '카페꼼마 여의도점',
      address_doro: '서울 영등포구 국제금융로8길 16 1층 카페꼼마',
      lat: 37.5213006,
      lng: 126.9288968,
      description: '문학동네에서 운영하는 대형 북카페',
      categories: '1,2',
      visible: 1,
      deleted: 0,
      created: '2025-02-14T06:24:38.000Z',
      updated: '2025-03-10T21:21:32.000Z',
    },
  ];

  const setMap = (naver: any, location: any) => {
    try {
      const map = new naver.maps.Map(mapRef.current, {
        center: location,
        zoom: 11,
        zoomControl: true,
        zoomControlOptions: {
          style: naver.maps.ZoomControlStyle.SMALL,
          position: naver.maps.Position.TOP_RIGHT,
        },
      });
      return map;
    } catch (error) {
      console.error('지도 생성 중 오류 발생:', error);
      return null;
    }
  };

  const getSuccess = async (cafe: cafeInfo[]) => {
    try {
      const { naver } = window;
      if (!naver) throw new Error('네이버 지도 API를 찾을 수 없습니다.');
      let map;
      if (mapRef.current) {
        const location = new naver.maps.LatLng(37.5666103, 126.9783882);
        map = setMap(naver, location);
      }
      if (map) {
        //: 주소를 좌표로 변환하여 요소 추가해서 배열로 만들기
        const newCafe = await convertAddress(cafe);
        console.log(newCafe);
        if (!Array.isArray(newCafe) || newCafe.length === 0) {
          throw new Error('위치 데이터가 유효하지 않습니다.');
        }
        for (let i = 0; i < newCafe.length; i++) {
          try {
            const latitude = newCafe[i].lat;
            const longitude = newCafe[i].lng;
            const location = new naver.maps.LatLng(latitude, longitude);
            setMarker(map, location);
          } catch (error) {
            console.error(`마커 생성 오류 (index: ${i}):`, error);
          }
        }
      }
    } catch (error) {
      console.error('위치 정보 처리 중 오류 발생:', error);
    }
  };

  const setMarker = (map: any, location: any) => {
    try {
      new naver.maps.Marker({
        position: location,
        map,
      });
    } catch (error) {
      console.error('마커 추가 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    getSuccess(cafePosition);
  }, []);

  const convertAddress = async (cafe: cafeInfo[]) => {
    const geocodePromise = (
      address: string,
    ): Promise<{ lat: number; lng: number }> => {
      return new Promise((resolve, reject) => {
        naver.maps.Service.geocode({ query: address }, (status, response) => {
          if (status === naver.maps.Service.Status.ERROR) {
            return reject(new Error('Something wrong!'));
          }
          const lat = Number(response.v2.addresses[0].y);
          const lng = Number(response.v2.addresses[0].x);
          resolve({ lat, lng });
        });
      });
    };
    try {
      const coordinateAddCafe = await Promise.all(
        cafe.map(async (value) => {
          //: map안에서 비동기
          const { lat, lng } = await geocodePromise(value.address_doro);
          return { ...value, lat, lng };
        }),
      );
      return coordinateAddCafe;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="map" ref={mapRef} style={{ width: '100%', height: '400px' }}>
      Maps
    </div>
  );
};

export default Maps;
