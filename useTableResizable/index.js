import { useState } from 'react';
import { useRequest, useUpdateEffect } from 'ahooks';

// 提取封装table属性， 模仿ahooks里的use-antd-table
// https://ahooks.js.org/hooks/table/use-antd-table
export default function useTableResizable(fetchList) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // eslint-disable-next-line
  const [selectedRows, setSelectedRows] = useState([]);
  // 默认每页加载20条
  const [pageSize, setPagesize] = useState(20);
  // 默认第一页
  const [page, setPage] = useState(1);
  // 存储查询条件数据
  const [queryData, setQueryData] = useState({});
  // 调取接口
  const result = useRequest(fetchList, {
    defaultPageSize: 20,
    paginated: true,
    // 手动调用接口
    manual: true,
  });

  const { run } = result;

  // 加载参数 首次不加载
  useUpdateEffect(() => {
    run({
      pageSize,
      page,
      queryData,
    });
  }, [page, pageSize]);

  // 提交
  const submit = queryData => {
    setQueryData(queryData);
    run({
      pageSize,
      page,
      queryData,
    });
  };

  // 重置
  const reset = queryData => {
    setPage(1);
    setQueryData(queryData);
    run({
      pageSize,
      page: 1,
      queryData,
    });
  };

  // 页数修改
  const onShowSizeChange = (current, pageSize) => {
    setPagesize(pageSize);
    setPage(1);
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };
  // 点击页码事件
  const onChangePage = page => {
    setPage(page);
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const handleSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };
  // antd 表格属性
  return {
    selectedRowKeys,
    selectedRows,
    submit,
    reset,
    bordered: true,
    ...result,
    dataSource:
      (result.data && result.data.data && result.data.code === 1 && result.data.data.rows) || [],
    pagination: {
      ...result.pagination,
      total: result.data && result.data.data && result.data.code === 1 && result.data.data.total,
      pageSizeOptions: ['20', '50', '100', '200'],
      showSizeChanger: true,
      size: 'small',
      onShowSizeChange: onShowSizeChange,
      onChange: onChangePage,
      pageSize,
      current: page,
    },
    rowSelection: {
      onChange: handleSelectChange,
      selectedRowKeys,
    },
  };
}
