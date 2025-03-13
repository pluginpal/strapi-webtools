import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const useQueryParams = () => {
  const location = useLocation();
  const [params, setParams] = useState<string>();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get('page');
    const pageSize = searchParams.get('pageSize');

    if (page || pageSize) {
      if (page) {
        searchParams.delete('page');
        searchParams.append('pagination[page]', page);
      }

      if (pageSize) {
        searchParams.delete('pageSize');
        searchParams.append('pagination[pageSize]', pageSize);
      }

      setParams(searchParams.toString());
    }
  }, [location]);

  return params;
};

export default useQueryParams;
