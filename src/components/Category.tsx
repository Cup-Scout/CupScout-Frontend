import styled from 'styled-components';

interface categoryInfo {
  category: string;
  created: string;
  description: string;
  id: number;
  updated: string;
}

interface CategoryProps {
  categoryListArr: categoryInfo[];
}

const Category = ({ categoryListArr }: CategoryProps) => {
  return (
    <CategoryNav>
      <ul>
        {categoryListArr.length !== 0 &&
          categoryListArr.map((value) => (
            <li key={value.id}>{value.description}</li>
          ))}
      </ul>
    </CategoryNav>
  );
};

const CategoryNav = styled.nav`
  width: 100%;
  margin: 1.2rem 0 1.2rem 0;

  ul {
    display: flex;
    overflow-x: scroll;
    flex-wrap: nowrap;
    align-items: center;
    box-sizing: border-box;

    li {
      background-color: #d9d9d9;
      border-radius: 12px;
      padding: 8px;
      padding-top: 9px;
      white-space: nowrap;
      margin-right: 6px;
      font-size: 0.9rem;
    }
  }
`;

export default Category;
