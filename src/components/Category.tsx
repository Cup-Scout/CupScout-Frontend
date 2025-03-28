import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface categoryInfo {
  category: string;
  created: string;
  description: string;
  id: number;
  updated: string;
}

const Category = ({ selectedCategories, setSelectedCategories }: any) => {
  const [categoryMenuListArr, setCategoryMenuListArr] = useState<
    categoryInfo[]
  >([]);

  const getCategory = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_LOCAL_API_URL}/api/categories`,
    );
    const categoryList = await response.json();
    setCategoryMenuListArr(categoryList);
  };

  useEffect(() => {
    getCategory();
  }, []);

  const selectCategory = async (id: number) => {
    const newSelected = new Set(selectedCategories);
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    setSelectedCategories(newSelected);
  };

  return (
    <CategoryNav>
      <ul>
        {categoryMenuListArr.length !== 0 &&
          categoryMenuListArr.map((value) => (
            <li
              key={value.id}
              onClick={() => selectCategory(value.id)}
              className={selectedCategories.has(value.id) ? 'selected' : ''}
            >
              #{value.description}
            </li>
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
    padding-bottom: 5px;

    li {
      background-color: #d9d9d9;
      border-radius: 12px;
      padding: 8px;
      padding-top: 9px;
      white-space: nowrap;
      margin-right: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      &:active {
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
      }
      &.selected {
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
      }
    }
  }
`;

export default Category;
