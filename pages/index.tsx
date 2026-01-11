import ListData from "@/components/ListData";
import { getWeekRange } from "@/utils/dateUtils";
import { useCallback, useEffect, useState } from "react";
import "react-virtualized/styles.css";

export interface IListData {
  "ATBLID": number,
  "ALOGINNAME": string,
  "AERRCODE": number,
  "AERRMESSAGE": string,
  "ASOURCE": string,
  "AIPSERVER": string,
  "AIPCLIENT": string,
  "AREFERER": string,
  "AUSERAGENT": string,
  "ABROWSER": string,
  "ALOGINTIME": string,
  "AACTIVITY": string,
  "AACTIVITYUSR": string,
  "AACTIVITYDSC": string,
  "AACTIVITYBTNTYPE": string,
  "AISMOBILE": string,
  "ABROWSERNAME": string,
  "ABROWSERVERS": string,
  "ABRKID": string,
  "AACTIVITYDES": string,
  "ADEVICE": string
}

// Component demo dùng để mount/unmount OtpInput bằng nút bấm
export default function Home() {
  const [isState, setIsState] = useState(false);
  const [listData, setListData] = useState<IListData[]>([]);
  const [loading, setLoading] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // API call function
  const fetchWeekData = useCallback(async (weekOffsetToFetch: number) => {
    setLoading(true);
    try {
      const weekRange = getWeekRange(weekOffsetToFetch);

      console.log('Fetching data for week:', weekOffsetToFetch, weekRange);

      const response = await fetch("https://uatgateway.ezgsm.fpts.com.vn/sg/api/gateway/v1/account/ore_activities_get", {
        method: "POST",
        body: JSON.stringify({
          "fromDate": weekRange.fromDate,
          "toDate": weekRange.toDate
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJUb2tlbiI6IjI5YWQxNDJhLWQxZDEtNGU5Mi1hNDgwLTY5Zjg0ZTk4YTkxOCIsIlNlZXNpb24iOiJGbDlSc3VrVnVmT1RuZkkwVUlzNzhBPT0iLCJuYmYiOjE3NjgxMzY4NTksImV4cCI6MTc2ODM5NjA1OSwiaWF0IjoxNzY4MTM2ODU5LCJpc3MiOiJFekFjY291bnQifQ.72oRONUKv6YEOqQPXOf0U-IWw41DRL84u2XF-xhOehc"
        }
      });

      const data = await response.json();
      const newData = data.Data || [];

      if (weekOffsetToFetch === 0) {
        // Initial load - replace all data
        setListData(newData);
      } else {
        // Append new data
        setListData(prev => [...prev, ...newData]);
      }

      // Check if there's more data (if we got data back, assume there might be more)
      setHasMore(newData.length > 0);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Load more data function for infinite scroll
  const loadMoreData = useCallback(() => {
    console.log('loadMoreData called:', { loading, isLoadingMore, hasMore, weekOffset });
    if (!loading && !isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      const nextOffset = weekOffset + 1;
      console.log('Setting weekOffset to:', nextOffset);
      setWeekOffset(nextOffset);

      // Call fetchWeekData with the new offset directly
      const weekRange = getWeekRange(nextOffset);
      console.log('Fetching data for week:', nextOffset, weekRange);

      setLoading(true);
      fetch("https://uatgateway.ezgsm.fpts.com.vn/sg/api/gateway/v1/account/ore_activities_get", {
        method: "POST",
        body: JSON.stringify({
          "fromDate": weekRange.fromDate,
          "toDate": weekRange.toDate
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJUb2tlbiI6IjI5YWQxNDJhLWQxZDEtNGU5Mi1hNDgwLTY5Zjg0ZTk4YTkxOCIsIlNlZXNpb24iOiJGbDlSc3VrVnVmT1RuZkkwVUlzNzhBPT0iLCJuYmYiOjE3NjgxMzY4NTksImV4cCI6MTc2ODM5NjA1OSwiaWF0IjoxNzY4MTM2ODU5LCJpc3MiOiJFekFjY291bnQifQ.72oRONUKv6YEOqQPXOf0U-IWw41DRL84u2XF-xhOehc"
        }
      }).then(async response => {
        const data = await response.json();
        const newData = data.Data || [];

        setListData(prev => [...prev, ...newData]);
        setHasMore(newData.length > 0);
      }).catch(error => {
        console.error('Error fetching data:', error);
      }).finally(() => {
        setLoading(false);
        setIsLoadingMore(false);
      });
    }
  }, [loading, isLoadingMore, hasMore, weekOffset]);

  useEffect(() => {
    setIsState(true);
    // Initial load - chỉ gọi 1 lần khi component mount
    fetchWeekData(0);
  }, []);

  if (!isState) return null;

  return (
    <div style={{ width: "100%", height: "565px" }}>
      <ListData
        listData={listData}
        loadMoreData={loadMoreData}
        loading={loading}
        hasMore={hasMore}
      />
    </div>
  );
}
