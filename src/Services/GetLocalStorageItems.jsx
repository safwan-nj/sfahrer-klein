/* Get the device_id from LocalStorage */
const GetLocalStorageItems = (item) => {
  let localItems = localStorage.getItem(item);
  if (!localItems) {
      alert('Bitte Login! \nDevice_id has been Set to Default');
      //return
    // إذا كان العنصر غير موجود في LocalStorage
    localStorage.setItem("device_id", "KLASC134");
    localItems = "KLASC134"; // قم بتعيين القيمة المحددة في هذه الحالة
  }
  return (localItems);
}

export default GetLocalStorageItems;
