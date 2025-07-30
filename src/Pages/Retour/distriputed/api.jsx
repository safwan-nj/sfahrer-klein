export const AxiosConnect = async (method, endpoint, deviceName, data) => {
    // منطق الـ Axios هنا (يفترض أنه موجود في الكود الأصلي)
    // مثال بسيط:
    console.log(`Calling ${endpoint} with ${method} and data:`, data);
    return new Promise((resolve) => resolve([])); // محاكاة استجابة الـ API
  };
  
  export const GetLocalStorageItems = (key) => {
    return localStorage.getItem(key) || '';
  };