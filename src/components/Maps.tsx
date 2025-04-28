import { useEffect, useRef, useState } from 'react';
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
interface markerInfo {
  id: number;
  addressDoro: string;
  cafeName: string;
}

const Maps = ({
  cafeListArr,
  setSelectedCafe,
  toggleExpand,
  setSwitchContent,
}: any) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [clickMarkerInfo, setClickMarkerInfo] = useState<markerInfo | null>(
    null,
  );

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

  const getSuccess = async (cafeListArr: cafeInfo[] | null) => {
    try {
      const { naver } = window;
      if (!naver) throw new Error('네이버 지도 API를 찾을 수 없습니다.');
      let map: any;
      if (mapRef.current) {
        const location = new naver.maps.LatLng(37.5666103, 126.9783882);
        map = setMap(naver, location);
      }
      let cafeList: cafeInfo[];
      if (cafeListArr === null) {
        cafeList = await getCafe();
      } else {
        cafeList = cafeListArr;
      }
      // const cafeList = await getCafe();
      if (map && cafeList.length) {
        //: 주소를 좌표로 변환하여 요소 추가해서 배열로 만들기
        const newCafe = await convertAddress(cafeList);
        if (!Array.isArray(newCafe) || newCafe.length === 0) {
          throw new Error('위치 데이터가 유효하지 않습니다.');
        }
        for (let i = 0; i < newCafe.length; i++) {
          try {
            const latitude = newCafe[i].lat;
            const longitude = newCafe[i].lng;
            const addressDoro = newCafe[i].address_doro;
            const id = newCafe[i].id;
            const cafeName = newCafe[i].name;
            const location = new naver.maps.LatLng(latitude, longitude);
            const { markers }: any = setMarker(map, location);
            naver.maps.Event.addListener(map, 'idle', function () {
              updateMarkers(map, markers);
            });
            const updateMarkers = (map: any, markers: any) => {
              var mapBounds = map.getBounds();
              var marker, position;

              for (var i = 0; i < markers.length; i++) {
                marker = markers[i];
                position = marker.getPosition();

                if (mapBounds.hasLatLng(position)) {
                  showMarker(map, marker);
                } else {
                  hideMarker(marker);
                }
              }
            };

            const showMarker = (map: any, marker: any) => {
              if (marker.setMap()) return;
              marker.setMap(map);
            };

            const hideMarker = (marker: any) => {
              if (!marker.setMap()) return;
              marker.setMap(null);
            };

            const openSelectedCafeInfo = (id: number) => {
              cafeList.forEach((cafe) => {
                if (cafe.id === id) {
                  setSelectedCafe(cafe);
                }
              });
            };

            // 해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환
            const getClickHandler = () => {
              return function () {
                setClickMarkerInfo({ id, cafeName, addressDoro });
                openSelectedCafeInfo(id);
                toggleExpand(id);
                setSwitchContent(false);
              };
            };

            for (var j = 0, jj = markers.length; j < jj; j++) {
              naver.maps.Event.addListener(
                markers[j],
                'click',
                getClickHandler(),
              );
            }
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
    let markers = [];
    try {
      const marker = new naver.maps.Marker({
        position: location,
        map,
        // icon: {
        //   url: markerIcon,
        //   size: new naver.maps.Size(22, 35),
        //   origin: new naver.maps.Point(0, 0),
        //   anchor: new naver.maps.Point(11, 35),
        // },
      });

      markers.push(marker);
      return { markers };
    } catch (error) {
      console.error('마커 추가 중 오류 발생:', error);
    }
  };

  const getCafe = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_LOCAL_API_URL}/api/cafes`,
    );
    const cafeList = response.json();
    return cafeList;
  };

  useEffect(() => {
    //: cafeList가 변할때마다 지도 함수 다시 실행
    getSuccess(cafeListArr);
  }, [cafeListArr]);

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
    <Section>
      <MapBox id="map" ref={mapRef} style={{ width: '100%', height: '300px' }}>
        Maps
      </MapBox>
      {clickMarkerInfo && (
        <AddressWrapper>
          <p>{clickMarkerInfo.cafeName}</p>
          <p>
            <span>도로명</span>
            {clickMarkerInfo.addressDoro}
          </p>
        </AddressWrapper>
      )}
    </Section>
  );
};
const Section = styled.section`
  position: relative;
`;

const MapBox = styled.div`
  border-radius: 12px;
`;
const AddressWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 100;
  background-color: #fff;
  padding: 8px;
  border: 1px solid #9e9e9e;
  border-radius: 12px;
  p:first-child {
    font-size: 12px;
    margin-bottom: 4px;
  }
  p:last-child {
    font-size: 10px;
    span {
      display: inline-block;
      background-color: #d9d9d9;
      color: #363636;
      padding: 3px 5px;
      border-radius: 12px;
      margin-right: 4px;
    }
  }
`;

export default Maps;
