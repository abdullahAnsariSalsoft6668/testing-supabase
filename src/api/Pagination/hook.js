
import {useEffect, useState} from 'react';
import {LOG} from '@/utils/helperFunction';

export const usePagination = (fetchData, config = {}, id, resetKey) => {
  const [pageParams, setPageParams] = useState({
    page: 1,
    limit: config.limit || 10,
    ...config,
  });

  const [isRefresh, setIsRefresh] = useState(false);

  const {data, isLoading, isFetching, refetch, error} = fetchData(pageParams, {
    refetchOnMountOrArgChange: true,
  });

  LOG('pageParams', pageParams);
  LOG('data', data);
  LOG('error', error);

  const loadMore = () => {
    if (!isFetching && data?.hasNextPage) {
      setPageParams(prev => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  const refresh = () => {
    setPageParams(prev => ({
      ...prev,
      page: 1,
    }));
    setIsRefresh(true);
    refetch();
  };

  // If config changes (like payload), reset to page 1
  useEffect(() => {
    setPageParams(prev => ({
      ...prev,
      page: 1,
      ...config,
    }));
  }, [JSON.stringify(config)]);

  // Reset the list when resetKey changes
  useEffect(() => {
    if (resetKey) {
      setPageParams({
        page: 1,
        limit: config.limit || 10,
        ...config,
      });
    }
  }, [resetKey]);

  // Reset isRefresh state when done
  useEffect(() => {
    if (!isFetching && isRefresh) {
      setIsRefresh(false);
    }
  }, [isFetching, isRefresh]);

  return {
    data,
    isLoading,
    isFetching,
    loadMore,
    refresh,
    isRefresh,
    refetch,
    error,
  };
};
