// pinia持久化参数配置
const piniaPersistConfig = (key) => {
  return {
    enabled: true,
    strategies: [
      {
        key,
        // storage: localStorage
        storage: sessionStorage
      }
    ]
  };
};

export default piniaPersistConfig;
