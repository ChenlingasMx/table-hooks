import { useBoolean, useRequest } from 'ahooks';
import { message } from 'antd';

export default function useExport(service) {
  const [visible, { toggle, setTrue, setFalse }] = useBoolean(false);

  // error,
  const { data, loading, run } = useRequest(service, {
    manual: true,
  });

  // 导出确定
  const onExport = async () => {
    await run();

    if (data && data.code === 1) {
      message.success(data.message);
      setFalse();
    }
    // console.log(error)
  };
  // 关闭导出
  const handleCancel = () => {
    setFalse();
  };

  return {
    visible: visible,
    loading,
    onExport,
    setTrue,
    toggle,
    handleCancel,
  };
}
