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
  // const [categoryMenuListArr, setCategoryMenuListArr] = useState<
  //   categoryInfo[]
  // >([]);

  const [line1, setLine1] = useState<categoryInfo[]>([]);
  const [line2, setLine2] = useState<categoryInfo[]>([]);

  const getCategory = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_LOCAL_API_URL}/api/categories`,
    );
    const categoryList = await response.json();
    if (categoryList.length === 4) {
      setLine1(categoryList.slice(0, 3));
      setLine2(categoryList.slice(3, 4));
      return;
    }
    const half = Math.ceil(categoryList.length / 2);
    setLine1(categoryList.slice(0, half));
    setLine2(categoryList.slice(half));
    // setCategoryMenuListArr(categoryList);
  };

  useEffect(() => {
    getCategory();
  }, []);

  const selectCategory = (id: number) => {
    //: 이전 카테고리
    const newSelected = new Set(selectedCategories);
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    setSelectedCategories(newSelected);
  };

  return (
    <CategoryNav>
      <div className="scroll-container">
        <div className="line">
          {line1.map((item) => (
            <span
              key={item.id}
              onClick={() => selectCategory(item.id)}
              className={selectedCategories.has(item.id) ? 'selected' : ''}
            >
              #{item.description}
            </span>
          ))}
        </div>
        <div className="line">
          {line2.map((item) => (
            <span
              key={item.id}
              onClick={() => selectCategory(item.id)}
              className={selectedCategories.has(item.id) ? 'selected' : ''}
            >
              #{item.description}
            </span>
          ))}
        </div>
      </div>
    </CategoryNav>
  );
};

const CategoryNav = styled.nav`
  width: 100%;
  margin: 1.2rem 0 0.8rem 0;

  .scroll-container {
    overflow-x: auto;
    white-space: nowrap;

    &::-webkit-scrollbar {
      height: 3px;
    }
  }

  .line {
    display: flex;
    margin-bottom: 4px;

    span {
      display: inline-block;
      background-color: #d9d9d9;
      border-radius: 12px;
      padding: 8px 12px;
      margin-right: 6px;
      white-space: nowrap;
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
