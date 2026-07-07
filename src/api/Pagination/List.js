import React, {forwardRef, useImperativeHandle} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {usePagination} from './hook';

import ActivityLoader from '../../components/ActivityLoader';
import {vh, vw} from '../../theme/units';

import {colors2} from '../../theme/colors2';
import {layout, spacing} from '../../theme/styles';

import {LOG} from '@/utils/helperFunction';
import ListShimmer from '../../components/Shimmers/ListShimmer';
import EmptyDataComponent from '../../components/EmptyDataComponent';

const PaginatedList = forwardRef((props, ref) => {
  const {
    contentContainerStyle,
    fetchData,
    renderItem,
    scrollEnabled,
    id,
    payload = {},
    ListHeaderComponent,
    ListFooterComponent,
    resetKey,
  } = props;
  const {data, isLoading, isFetching, loadMore, refresh, isRefresh, refetch} =
    usePagination(fetchData, {...payload}, id, resetKey);
  LOG('payload----', payload);
  LOG('data?.data?.data', data);
  LOG('isFetching-isFetching', isFetching);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    refetch,
  }));

  // const getFlatListData = () => {
  //   const flatListData = data?.docs;
  //   // Object.entries(data.docs || {}).forEach(([date, entries]) => {
  //   //   flatListData.push({type: 'header', date});
  //   //   entries?.forEach(entry => flatListData.push({type: 'entry', ...entry}));
  //   // });
  //   return flatListData;
  // };
  // const flatListData = getFlatListData();

  if (isLoading) {
    return <ListShimmer />;
  }
  return (
    <>
      {/* {ListHeaderComponent && ListHeaderComponent()} */}

      <FlatList
        contentContainerStyle={contentContainerStyle}
        data={data?.docs}
        scrollEnabled={scrollEnabled}
        renderItem={renderItem}
        style={{maxHeight: vh * 150, height: vh * 150}}
        refreshControl={
          <RefreshControl refreshing={isRefresh} onRefresh={refresh} />
        }
        onEndReached={() => {
          if (data?.hasNextPage) {
            loadMore();
          }
        }}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={() => (
          <EmptyDataComponent message="No Items Found" />
        )}
        ListFooterComponent={() => {
          return isFetching ? (
            <ActivityLoader
              color={colors2.theme.greyAlt2}
              style={{
                justifyContent: 'center',
                alignItem: 'center',
                borderRadius: 50,
                alignSelf: 'center',
                padding: 4,
                backgroundColor: colors2.theme.white,
                elevation: 4,
                marginVertical: 2,
              }}
              size="small"
            />
          ) : ListFooterComponent ? (
            ListFooterComponent()
          ) : null;
        }}
      />
    </>
  );
});

export default PaginatedList;
