import styled from 'styled-components';
import bottomArrow from '../assets/bottom-arrow.png';

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

interface cafeListArrProps {
  cafeListArr: cafeInfo[];
}

const CafeList = ({ cafeListArr }: cafeListArrProps) => {
  return (
    <Section>
      <ul>
        {cafeListArr.length !== 0 &&
          cafeListArr.map((value) => (
            <li key={value.id}>
              <div>
                <span></span>
                {value.name}
              </div>
              <button>
                <img src={bottomArrow} alt="bottom arrow" />
              </button>
            </li>
          ))}
      </ul>
    </Section>
  );
};

const Section = styled.section`
  ul {
    li {
      border: 1px solid #9e9e9e;
      border-radius: 10px;
      padding: 14px 10px 14px 10px;
      margin: 11px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
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
    }
  }
`;

export default CafeList;
