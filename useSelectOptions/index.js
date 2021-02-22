import { useMemo } from 'react';
import { useRequest } from 'ahooks';

// 提取封装searchform里的select属性

export default function useSelectOptions(service) {
  // error,
  const { data, loading, run } = useRequest(service.api, {
    manual: true,
  });

  const Actions = useMemo(() => {
    // 处理搜索
    const onSearch = value => {
      run(service.queryData(value));
    };

    // 处理focus事件
    const onFocus = () => {
      run(service.queryData());
    };

    let option = [];

    // 处理数据 整成object[]形式
    if (data && data.code === 1) {
      option =
        data.data &&
        data.data.rows.map(itm => ({
          label: itm.id,
          value: itm.id,
        }));
    }

    return {
      notFoundContent: '暂无数据',
      loading,
      onSearch,
      onFocus,
      option,
    };
  }, [service.api, service.queryData, loading]);

  return Actions;
}
