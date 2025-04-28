import { useState, useEffect } from 'react';

const useDebounce = (
  value: { nickname: string; password: string; content: string },
  delay: number,
) => {
  const [query, setQuery] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return query;
};
export default useDebounce;
