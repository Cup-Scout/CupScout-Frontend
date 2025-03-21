import styled from 'styled-components';
import searchIcon from '../assets/search-icon.png';

const Search = () => {
  return (
    <Section>
      <Input type="text" placeholder="카페검색" />
      <StyledButton type="button">
        <Icon src={searchIcon} alt="search" />
      </StyledButton>
    </Section>
  );
};

const Section = styled.section`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`;

const Input = styled.input`
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
