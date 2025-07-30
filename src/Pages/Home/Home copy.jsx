//import Input from "../Components/input";
import * as FaIcons from 'react-icons/fa';
import './Home.css';
import {ButtonPrimary, InputPrimary, CustomerRow} from '../../Components';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addToInvoices, clearAllInvoices } from '../../Redux/invoicesSlice';
import { AxiosConnect, OptimizerConnect } from '../../Services';

function Home() {
  const ref = useRef();
  const scrollViewRef = useRef();
  const [invoiceCode, setInvoiceCode] = useState('');
  const [invoiceData, setInvoiceData] = useState([]);
  const [isScanned, setIsScanned] = useState(false);
  const [isPressed, setIsPressed] = useState({});
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [optimizedInvoicesToDispatch, setOptimizedInvoicesToDispatch] = useState([]);
  const [optimizedInvoices, setOptimizedInvoices] = useState([]);
  const [groupedItemsInBasket, setGroupedItemsInBasket] = useState([]);
  const [totalBrutto, setTotalBrutto] = useState(0);
  const [totalArrival, setTotalArrival] = useState("");
  const [jobList, setJobList] = useState([]);
  const [startPointOfTheTour, setStartPointOfTheTour] = useState([]);
  const [endPointOfTheTour, setEndPointOfTheTour] = useState([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [devName, setDevName] = useState("");
  const dispatch = useDispatch();  
  const navigate = useNavigate();
  //const location = useLocation();

  /* Get the device_id from LocalStorage */
  const getLocalStorageItems=()=>{
    const localItems = localStorage.getItem('device_id') ? localStorage.getItem('device_id') : 'KLASC134';
    if (localItems) {
      return JSON.stringify(localItems);
    }
    else
      return("The device_id are empty");
  }

  /* useEffect(() => {
    // تحديث الموقع عند فتح التطبيق
    const currentPath = location.pathname;
    console.log('Current Path:', currentPath);
    const originalPath = document.referrer;
    console.log('Original Path:', originalPath);
    // حفظ العنوان المحول في localStorage دون حذف المحتوى السابق
    localStorage.setItem('originalPath', originalPath);

    // ... الأكواد الأخرى في useEffect
  }, [location]); */

  /* Get the device_id + device coordinates */
  useEffect(() => {
    const fetchData = async () => {
      // ولكن تأكد من التعامل مع تصاريح الموقع بشكل صحيح
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("longitude::: ", longitude);
          console.log("latitude::: ", latitude);
          setLongitude(longitude);
          setLatitude(latitude);
          dispatch(clearAllInvoices());
        },
        (error) => {
          console.error('Error getting location:', error.message);
        }
      );
    };
    fetchData();
    const deviceName = getLocalStorageItems();
    console.log("DEVICE_ID:::::::", deviceName);
    setDevName(deviceName);
  }, []);

  const jobsData = invoiceData.length > 0 ? invoiceData.map((invoice, index) => ({
    id: index + 1,
    location: [Number(invoice.lon), Number(invoice.lat)]
  })) : [];
  const organizedData = {
    vehicles: [
      {
        id: 1,
        start: [(longitude < 0) || (longitude == null) || (latitude < 0) || (latitude == null) ? 12.9899 : longitude, (latitude < 0) || (latitude == null) ? 47.7939 : latitude],
        end: [(longitude < 0) || (longitude == null) || (latitude < 0) || (latitude == null) ? 12.9899 : longitude, (latitude < 0) || (latitude == null) ? 47.7939 : latitude]
      }
    ],
    jobs: jobsData
  };
  

  useEffect(() => {
    console.log("invoiceData::: ", JSON.stringify(invoiceData));
    console.log("organizedData::: ", JSON.stringify(organizedData));
    if (organizedData.jobs.length > 0) {
      OptimizerConnect(organizedData)
        .then((response) => {
          console.log("response.routes::: ", typeof (response.routes), response.routes[0].steps);
          // استخراج العناصر التي تحتوي على type: job
          const jobItems = response.routes[0].steps.filter(item => item.type === "job");
          const startTour = response.routes[0].steps.filter(item => item.type === "start");
          const endTour = response.routes[0].steps.filter(item => item.type === "end");
          console.log("jobItems::: ", jobItems);
          console.log("startTour::: ", startTour);
          console.log("endTour::: ", endTour);
          // تعيين قيمة الاعمال job
          setJobList(jobItems);
          // تعيين قيمة البداية job
          setStartPointOfTheTour(startTour);
          // تعيين قيمة النهاية job
          setEndPointOfTheTour(endTour);
          // إنشاء مصفوفة جديدة بناءً على العناصر المرتبة
          const newInvoiceData = invoiceData.map((invoice, index) => ({ id: index + 1, ...invoice }));
          console.log("newInvoiceData::: ", newInvoiceData);

          const sortedNewInvoiceData = newInvoiceData.sort((a, b) => {
            const idA = jobItems.findIndex(item => item.id === a.id);
            const idB = jobItems.findIndex(item => item.id === b.id);
            return idA - idB;
          });

          //sortedNewInvoiceData.push({"deviceName":devName});
          sortedNewInvoiceData.forEach(item => {
            item.devName = devName;
          });

          console.log("sortedNewInvoiceData::: ", sortedNewInvoiceData);
          // dispatch to the store slices
          //dispatch(addToInvoices({invoiceData}));

          setOptimizedInvoices(sortedNewInvoiceData);
          //setOptimizedInvoices(mergedInvoices(sortedNewInvoiceData));
          //console.log("acc::: ", mergedInvoices(sortedNewInvoiceData));

        })
        .catch((error) => {
          console.log("error::: ", JSON.stringify(error));
        }
        );
    }
  }, [invoiceData/* , organizedData */]);

  useEffect(() => {
    let sum = 0;
    for (const invoice of optimizedInvoices) {
      const brutto = parseFloat(invoice.brutto);
      if (!isNaN(brutto)) {
        sum += brutto;
      }
    }
    // تنسيق المجموع إلى الشكل "xxx,xx" بعد الفاصلة
    const formattedTotalBrutto = sum.toFixed(2).replace('.', ',');
    setTotalBrutto(formattedTotalBrutto);
  }, [optimizedInvoices]);

  useEffect(()=>{
    //console.warn(items);
    const groupedItems = optimizedInvoices.reduce((results, item)=>{
        (results[item.name1] = results[item.name1] || []).push(item);
        return results;
    },{});
    console.log("groupedItems::: ", groupedItems);
    setGroupedItemsInBasket(groupedItems);
    
  }, [optimizedInvoices]);

  useEffect(() => {
  const groupedItems = optimizedInvoices.reduce((results, item) => {
    const matchingJob = jobList.find((job) => job.id === item.id);

    if (!matchingJob) {
      return results;
    }

    const arrivalTime = formattedTime(matchingJob.arrival);

    (results[item.name1] = results[item.name1] || []).push({ ...item, arrival: arrivalTime });
    return results;
  }, {});


  const optimizedItems = optimizedInvoices.reduce((results, item) => {
    const matchingJob = jobList.find((job) => job.id === item.id);

    if (!matchingJob) {
      return [...results]; // Create a new array with the existing items
    }

    const arrivalTime = formattedTime(matchingJob.arrival);

    return [...results, { ...item, arrival: arrivalTime }]; // Add the new item to the array
  }, []);

  console.log("optimizedItems::: ", optimizedItems);
  optimizedItems.startPointOfTheTour=startPointOfTheTour;
  optimizedItems.endPointOfTheTour=endPointOfTheTour;
  //optimizedItems.push(startPointOfTheTour, endPointOfTheTour);
  console.log("optimizedItemsWithStartEnd::: ", optimizedItems);
  setOptimizedInvoicesToDispatch(optimizedItems);
  //console.log("groupedItems::: ", groupedItems);
  setGroupedItemsInBasket(groupedItems);
  }, [optimizedInvoices]);

useEffect(() => {
  if (invoiceCode.length === 13 && invoiceCode !== "undefined" && invoiceCode !== '') {
    let slicedInvoiceCode = invoiceCode.slice(0, -5);

    AxiosConnect('POST', "navi_belegdaten", devName, slicedInvoiceCode)
      .then((response) => {
        console.log("response::: ", typeof(response), response);
        if (response) {
          setInvoiceData((prevState) => {
            return [...prevState, response];
          });
          console.log("response::: ", response);
          console.log("::::lon:::::", response.lon);
          setIsScanned(true);
          //setIsScrolled(false);
          setInvoiceCode('');
        } else {
          alert(
            'Sie haben einen falschen Scan durchgeführt.\nBitte überprüfen Sie den Barcode und versuchen Sie es erneut',
          );
          console.log('Invalid response or empty data');
          setInvoiceCode('');
          
        }
      })
      .catch((error) => {
        console.log(error);
        alert(
          'خطأ',
          'حدث خطأ أثناء جلب البيانات. يرجى التحقق من الرقم وإعادة المحاولة.',
          [{ text: 'موافق', onPress: () => console.log('OK Pressed') }]
        );
      });
  }
}, [invoiceCode]); // تحديد أن التأثير يعتمد فقط على تغيير invoiceCode

useEffect(() => {
  // حساب مجموع جميع أوقات arrival عندما يتغير groupedItemsInBasket
  const processedNames = []; // مصفوفة لتتبع الأسماء التي تمت معالجتها
  const totalArrivalTimeInSeconds = Object.values(groupedItemsInBasket).reduce((total, items) => {
    return items.reduce((sum, item) => {
      if (!processedNames.includes(item.name1)) {
        processedNames.push(item.name1);
        const [hours, minutes, seconds] = item.arrival.split(":").map(Number);
        return sum + (hours * 3600) + (minutes * 60) + seconds;
      }
      return sum;
    }, total);
  }, 0);

  // تحويل مجموع الثواني إلى ساعات:دقائق:ثواني
  const totalHours = Math.floor(totalArrivalTimeInSeconds / 3600);
  const totalMinutes = Math.floor((totalArrivalTimeInSeconds % 3600) / 60);
  const totalSeconds = totalArrivalTimeInSeconds % 60;
  const totalArrivalTimeString = `${totalHours}:${totalMinutes}:${totalSeconds}`;

  // تحديث قيمة totalArrival
  setTotalArrival(totalArrivalTimeString);
}, [groupedItemsInBasket]);

const formattedTime = (t)=> {
  const doneTime = new Date(t * 1000).toISOString();
  console.log("doneTime::: ", doneTime); // ستحصل على تاريخ مشابه لـ "2021-07-28T12:32:06"
  // القيام بالاقتطاع للحصول على الجزء المطلوب بتنسيق "03:24:17"
  const result = doneTime.substring(11, 19);
  console.log("result::: ", result);
  return result
}

const handlePreviewPress = () => {
  //console.log("acc::: ", mergedInvoices(optimizedInvoices));
  console.log("groupedItemsInBasket::: ", groupedItemsInBasket);
  setIsPreviewVisible(true);
  // تحديث الحالة في NavigationBarB عند النقر على "Vorschau"
};
const handleDrive = () => {
  setIsPreviewVisible(false);
  // dispatch to the store slices
  //dispatch(addToInvoices(groupedItemsInBasket));
  dispatch(addToInvoices(optimizedInvoicesToDispatch));
  navigate('/tour');
};

const removeItemFromInvoiceData = (itemToRemove) => {
  setInvoiceData((prevInvoiceData) => {
    const updatedInvoiceData = prevInvoiceData.filter((invoice) => invoice.bearbeitung_lfdnr !== itemToRemove.bearbeitung_lfdnr);
    return updatedInvoiceData;
  });
};

const toggleIsPressed = (key) => {
  setIsPressed((prevState) => ({
    ...prevState,
    [key]: !prevState[key],
  }));
};

  return (
    <div className='home'>
      <div className={`mb-28 mt-[-16px] bg-[#14193318] lg:pr-36 lg:pl-36 md:pr-24 md:pl-24 p-5 ${isScanned && "pb-14"}`}>
        <div className="relative">
          <div className="flex-row">
            <div className="flex-row flex-1 items-center rounded-full sa-bg-main-dark-transparent py-2">
              <div className="flex items-center w-full"> {/* تحديد items-center للتأكد من وسط العناصر */}
                <FaIcons.FaSistrix className="text-white w-6 h-6 m-2" /> {/* ضبط حجم الأيقونة وإضافة هامش للفصل بين الأيقونة ومربع الإدخال */}
                  <InputPrimary
                    innerRef={ref}
                    type="text"
                    maxLength={13}
                    value={invoiceCode}
                    autoFocus={true}
                    className="mx-2 w-full rounded-full mr-3"
                    placeholder="Scan QR Code"
                    onChange={(e) => {setInvoiceCode(e.target.value)}}
                    inputMode="none" // Add this line to prevent default keyboard 
                  />
              </div>
            </div>
          </div>

          {isScanned && (
            <div className="items-center justify-between">
              <p className="p-1 mx-3 rounded-lg text-center text-xs font-semibold text-gray-600">
                Total | Gescannte Lieferscheine: {totalBrutto}€
              </p>
            </div>
          )}
        </div>
        {isScanned && (
          <div
            ref={scrollViewRef}
            className=" h-full "
            //onContentSizeChange={!isScrolled ? handleContentSizeChange : null}
          >
            <div className="rounded-xl sa-bg-main-dark-transparent px-2 py-2 h-[65vh]" style={{overflowY: 'scroll' }}>
              <div className="items-center">
                {invoiceData.length !== 0 ? (
                  invoiceData.map((invoice, index) => {
                    return (
                      <CustomerRow
                        key={index}
                        id={Number(invoice.bearbeitung_lfdnr)}
                        name={index + 1 + ". " + invoice.name1}
                        description={" " + invoice.belegnummer}
                        name2={invoice.name2}
                        price={Number(invoice.brutto)}
                        customerImg="https://transfer.klein-autoteile.at/aussendienst/safwan/naviAssets/images/noimg.png"
                        customerAddress={" " + invoice.strasse + " ,\n" + invoice.plz + " " + invoice.ort}
                        lat={Number(invoice.lat)}
                        lon={Number(invoice.lon)}
                        removeItemFromInvoiceData={() => removeItemFromInvoiceData(invoice)}
                        items={invoiceData}
                      />
                    );
                  })
                ) : (
                  <p className="text-xsm text-center text-gray-400">No Data</p>
                )}
              </div>
              
            </div>
          </div>
        )}
        {optimizedInvoices.length > 0 && (
          <ButtonPrimary
            style={{ marginBottom: 28 }}
            title={`Vorschau (${optimizedInvoices.length}), Dauer: ${totalArrival}`}
            onPress={handlePreviewPress}
          />
        )}
        {isPreviewVisible && (
            <div className="flex-1 fixed top-0 left-0 right-0 bottom-0 justify-between items-center py-6 px-6 bg-[#141933]">
              <div className= "sa-bg-main-dark-transparent rounded-lg px-3 py-3" >
                <div className="flex-1 h-[55vh] divide-y divide-gray-200" style={{ overflowY: 'scroll' }}>
                  {Object.entries(groupedItemsInBasket).map(([key, items], index) => (
                    <div key={key} className={`w-full ${index !== 0 ? 'mt-4' : ''}`}>
                      {/* يمكنك استخدام onClick بدلاً من onPress */}
                      <div onClick={() => toggleIsPressed(key)}>
                        <div className="flex flex-row justify-between items-center bg-white px-5 py-4 space-x-3">
                          <div className="flex flex-row items-center space-x-3 flex-1">
                            {/* قد تحتاج إلى استخدام مكتبة لعرض الصور في ReactJS */}
                            <img
                              src="https://transfer.klein-autoteile.at/aussendienst/safwan/naviAssets/images/noimg.png"
                              alt="item-img"
                              className="w-12 h-12 rounded-full"
                            />
                            <span className="flex-1 text-gray-700 text-xs ">{items[0].name1}</span>
                          </div>
                          <div className="flex flex-row items-center space-x-3">
                            <span className="text-[#e50075] text-xs">{items.length} x</span>
                            <span onClick={() => removeItemFromInvoiceData(items[0])} className="text-[#e50075] text-xs">Remove</span>
                          </div>
                        </div>
                        {isPressed[key] && (
                          items.map((item, index) => (
                            <div
                              key={index}
                              className="flex-row justify-between items-center bg-white p-2 rounded-bl-lg rounded-br-lg pl-6 pr-6 mt-[-14] pb-4"
                            >
                              <span className="text-[#e50075] text-xs">
                                LS {index + 1}:
                              </span>
                              <span className="text-[#e50075] text-xs">
                                {item.belegnummer}
                              </span>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="flex flex-row w-full justify-between bg-white rounded-b-lg px-5 py-2">
                        <span className="text-left text-gray-400 text-xs">Job {index + 1}</span>
                        <span className="text-right text-gray-400 text-xs">Dauer: {items[0].arrival}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`flex flex-row bg-[#14193318] rounded-2xl `}>
                  <ButtonPrimary
                    style={{ marginBottom: 28 }}
                    title={`Fortsetzen`}
                    onPress={() => {setIsPreviewVisible(false);setActiveNavItem(0)}}
                  />
                  <ButtonPrimary
                    style={{ marginBottom: 28 }}
                    title={`Akzeptieren`}
                    onPress={handleDrive}
                  />
                </div>
              </div>
            </div>
        )}
        {/* <NavigationBarB activeIndexx={activeNavItem} onItemClick={setActiveNavItem} /> */}

      </div>
    </div>
  )
}

export default Home;