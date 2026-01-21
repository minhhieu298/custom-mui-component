import { IListData } from "@/pages";
import { parseBrowserName, parseDeviceType, parseOSName } from "@/utils/userAgentParser";
import { AutoSizer, InfiniteLoader, List, ListRowProps } from "react-virtualized";

const ListData = ({
  listData,
  loadMoreData,
  loading,
  hasMore
}: {
  listData: IListData[];
  loadMoreData: () => void;
  loading: boolean;
  hasMore: boolean;
}) => {
  console.log(listData);

  // Function to determine if a row is loaded
  const isRowLoaded = ({ index }: { index: number }) => {
    return !hasMore || index < listData.length;
  };

  // Function to load more rows
  const loadMoreRows = ({ startIndex, stopIndex }: { startIndex: number; stopIndex: number }) => {
    if (!loading && hasMore) {
      console.log('Loading more rows...', { startIndex, stopIndex });
      loadMoreData();
    }
    return Promise.resolve();
  };

  // Row renderer for InfiniteLoader
  const RowRendererWithLoader = ({ index, style }: ListRowProps) => {
    if (!isRowLoaded({ index })) {
      return (
        <div style={style} className="loading-row">
          <div>Loading...</div>
        </div>
      );
    }

    const item = listData[index];
    const browserName = parseBrowserName(item.AUSERAGENT);
    const osName = parseOSName(item.AUSERAGENT);
    const deviceType = parseDeviceType(item.AUSERAGENT);

    return (
      <div style={{ ...style, borderBottom: '1px solid #eee', padding: '10px' }} data-index={index}>
        <div>{item.AACTIVITYDES}</div>
        <div>{item.ALOGINTIME}</div>
      </div>
    );
  };

  return (
    <AutoSizer>
      {({ width, height }: { width: number; height: number }) => (
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={hasMore ? listData.length + 1 : listData.length}
          threshold={5}
        >
          {({ onRowsRendered, registerChild }) => (
            <List
              ref={registerChild}
              width={width}
              height={height}
              rowCount={hasMore ? listData.length + 1 : listData.length}
              rowHeight={120}
              rowRenderer={({ key, ...rest }) => (
                <RowRendererWithLoader key={key} {...rest} />
              )}
              onRowsRendered={onRowsRendered}
            />
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
};

export default ListData;