import { useEffect, useRef, useState } from 'react';

const Maps = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMapInstance] = useState<any>(null); // map 상태 추가

  //! 임시 position
  const cafePosition = [
    { lat: 37.5213006, lng: 126.9288968 },
    { lat: 37.4836332, lng: 126.9394218 },
    { lat: 37.4837762, lng: 126.928656 },
    { lat: 37.5677235, lng: 126.9704007 },
    { lat: 37.5699321, lng: 126.9841797 },
    { lat: 37.6488518, lng: 127.0137786 },
    { lat: 37.5806659, lng: 127.0228185 },
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

  const initialMaps = () => {
    const { naver } = window;
    if (!naver) throw new Error('네이버 지도 API를 찾을 수 없습니다.');
    if (mapRef.current) {
      const location = new naver.maps.LatLng(37.5666103, 126.9783882);
      const newMap = setMap(naver, location);
      setMapInstance(newMap); // map 상태 업데이트
    }
  };

  const getSuccess = (position: { lat: number; lng: number }[], map: any) => {
    try {
      const { naver } = window;
      if (!naver) throw new Error('네이버 지도 API를 찾을 수 없습니다.');
      if (map) {
        if (!Array.isArray(position) || position.length === 0) {
          throw new Error('위치 데이터가 유효하지 않습니다.');
        }
        for (let i = 0; i < position.length; i++) {
          try {
            const latitude = position[i].lat;
            const longitude = position[i].lng;
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
    initialMaps();
  }, []);

  useEffect(() => {
    if (map) {
      getSuccess(cafePosition, map);
    }
  }, [map]); // map이 생성된 후 getSuccess 실행

  return (
    <div id="map" ref={mapRef} style={{ width: '100%', height: '400px' }}>
      Maps
    </div>
  );
};

export default Maps;
