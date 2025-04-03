import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const useQueryParams = () => {
  const location = useLocation();
  const [params, setParams] = useState<string>();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get('page');
    const pageSize = searchParams.get('pageSize');
    searchParams.delete('page');
    searchParams.delete('pageSize');


    if (!page && !pageSize) {
      searchParams.append('pagination[page]', '1');
      searchParams.append('pagination[pageSize]', '10');
    }

    if (page && pageSize) {
      searchParams.append('pagination[page]', page);
      searchParams.append('pagination[pageSize]', pageSize);
    }

    setParams(searchParams.toString());
  }, [location]);

  return params;
};

export default useQueryParams;
