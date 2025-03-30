import { useEffect, useState } from 'react';
import qs from 'qs';
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

    const paramsObj = qs.parse(searchParams.toString());
    // @ts-expect-error
    const filters = paramsObj?.filters?.$and as Array<{ [key: string]: any }>;
    const localeFilterIndex = filters?.findIndex((filter) => filter.locale !== undefined);
    const localeFilter = filters?.[localeFilterIndex];

    if (localeFilter) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      paramsObj.locale = localeFilter.locale.$eq as string;
      filters.splice(localeFilterIndex, 1);
      // @ts-expect-error
      paramsObj.filters.$and = filters;
    }

    setParams(qs.stringify(paramsObj));
  }, [location]);

  return params;
};

export default useQueryParams;
