import { useState } from 'react';
import styled from 'styled-components';
import searchIcon from '../assets/search-icon.png';

const Search = ({ setCafeListArr, getOperatingStatus }: any) => {
  // const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const regex = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣a-zA-Z0-9\s]*$/;
    if (regex.test(inputValue)) {
      //: 정규식을 통과한 value만 set
      setValue(inputValue);
    }
  };

  const searchCafeName = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_LOCAL_API_URL}/api/cafes?name=${value}`,
    );
    const data = await response.json();
    const finalCafeInfo = await getOperatingStatus(data);
    setCafeListArr(finalCafeInfo);
  };

  return (
    <Section>
      <Input
        type="text"
        placeholder="카페검색"
        value={value}
        onChange={handleChange}
      />
      <StyledButton type="button" onClick={searchCafeName}>
        <Icon src={searchIcon} alt="search" />
      </StyledButton>
    </Section>
  );
};

const Section = styled.section`
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`;

const Input = styled.input`
  font-size: 16px;
  height: 100%;
  margin-right: 6px;
  flex-grow: 1;
  border-radius: 12px;
  border: 1px solid #9e9e9e;
  padding: 0px 10px;
`;

const StyledButton = styled.button`
  width: 24px;
  height: 24px;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

export default Search;
