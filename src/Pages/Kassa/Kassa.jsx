//import Input from "../Components/input";
import * as FaIcons from 'react-icons/fa';
import './Kassa.css';
import {ButtonPrimary, InputPrimary, CustomerRow, PreviewModal} from '../../Components';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addToKassa, clearAllKassa } from '../../Redux/kassaSlice';
import { addTouserLocation, clearAlluserLocation } from '../../Redux/userLocationSlice';
import { AxiosConnect, CreateJobs, GetCurrentCoordinates, GetLocalStorageItems, OptimizerConnect } from '../../Services';

function Kassa() {
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
  const [groupedItemsScanned, setGroupedItemsScanned] = useState([]);
  const [totalBrutto, setTotalBrutto] = useState(0);
  const [totalArrival, setTotalArrival] = useState("");
  const [timeArrival, setTimeArrival] = useState("");
  const [preventBodyScroll, setPreventBodyScroll] = useState(false);
  const [jobList, setJobList] = useState([]);
  const [startPointOfTheTour, setStartPointOfTheTour] = useState([]);
  const [endPointOfTheTour, setEndPointOfTheTour] = useState([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [devName, setDevName] = useState("");
  const dispatch = useDispatch();  
  const navigate = useNavigate();
  const location = useLocation();
  const organizedData = CreateJobs(invoiceData, longitude, latitude);
  // تحديث الموقع عند فتح التطبيق
  useEffect(() => {
    //const currentPath = location.pathname;
    const originalPath = document.referrer;
    // حفظ العنوان المحول في localStorage دون حذف المحتوى السابق
    localStorage.setItem('originalPath', originalPath);
  }, [location]);
  /* Get the device_id + device coordinates */
  useEffect(() => {
    GetCurrentCoordinates().then(({ latitude, longitude }) => {
      const deviceName = GetLocalStorageItems('device_id');
      setLongitude(longitude);
      setLatitude(latitude);
      dispatch(clearAllKassa());
      dispatch(clearAlluserLocation());
      dispatch(addTouserLocation({lat: latitude, long: longitude}));
      setDevName(deviceName);
    }).catch(error => {
        console.error('Error getting current coordinates:', error.message);
    });
  }, []);

  useEffect(() => {
    if (isScanned) {
      setPreventBodyScroll(true);
    } else {
      setPreventBodyScroll(false);
    }
  }, [isScanned]);

  useEffect(() => {
    if (preventBodyScroll) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }
  }, [preventBodyScroll]);

  
  /* Optimize organizedData and Set the jobItems, startTour, endTour */
  useEffect(() => {
    if (organizedData.jobs.length > 0) {
      OptimizerConnect(organizedData)
        .then((response) => {
          // استخراج العناصر التي تحتوي على type: job
          const jobItems = response.routes[0].steps.filter(item => item.type === "job");
          const startTour = response.routes[0].steps.filter(item => item.type === "start");
          const endTour = response.routes[0].steps.filter(item => item.type === "end");
          // تعيين قيمة الاعمال job
          setJobList(jobItems);
          // تعيين قيمة البداية job
          setStartPointOfTheTour(startTour);
          // تعيين قيمة النهاية job
          setEndPointOfTheTour(endTour);
          // تصفية الفواتير بحيث لا تحتوي على lat و lon
          const filteredInvoiceData = invoiceData.filter(invoice => !isNaN(Number(invoice.lon)) && !isNaN(Number(invoice.lat)));
          // إنشاء مصفوفة جديدة بناءً على العناصر المرتبة
          const newInvoiceData = filteredInvoiceData.map((invoice, index) => ({ id: index + 1, ...invoice }));
          const sortedNewInvoiceData = newInvoiceData.sort((a, b) => {
            const idA = jobItems.findIndex(item => item.id === a.id);
            const idB = jobItems.findIndex(item => item.id === b.id);
            return idA - idB;
          });
          sortedNewInvoiceData.forEach(item => {
            item.devName = devName;
          });
          console.log("sortedNewInvoiceData::: ", sortedNewInvoiceData);
          setOptimizedInvoices(sortedNewInvoiceData);
        })
        .catch((error) => {
          console.log("error::: ", JSON.stringify(error));
        });
    }
  }, [invoiceData]);

/* calculate the sum of the optimizedInvoices and setTotalBrutto*/
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
/* Group items that has the same name and setGroupedItemsScanned*/
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
  setGroupedItemsScanned(groupedItems);
  }, [optimizedInvoices]);

  useEffect(() => {
    if (invoiceCode.length === 13 && invoiceCode !== "undefined" && invoiceCode !== '') {
      let slicedInvoiceCode = invoiceCode.slice(0, -5);
  
      AxiosConnect('POST', "navi_belegdaten", devName, slicedInvoiceCode)
        .then((response) => {
          console.log("response::: ", typeof(response), response);
          if (response && response[0]) { // تحقق من وجود الرد والبيانات في الرد
            setInvoiceData((prevState) => {
              return [...prevState, response[0]];
            });
            console.log("::::lon:::::", response[0].lon);
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
            'Error',
            'Beim Abrufen der Daten ist ein Fehler aufgetreten. Bitte überprüfen Sie die Nummer und versuchen Sie es erneut.',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
          );
        }
      );
    }
  }, [invoiceCode]); // تحديد أن التأثير يعتمد فقط على تغيير invoiceCode
  

  useEffect(() => {
    // حساب مجموع جميع أوقات arrival عندما يتغير groupedItemsScanned
    const processedNames = []; // مصفوفة لتتبع الأسماء التي تمت معالجتها
    const totalArrivalTimeInSeconds = Object.values(groupedItemsScanned).reduce((total, items) => {
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
    const totalArrivalTimeString = `${totalHours}:${totalMinutes}`;

    // تحديث قيمة totalArrival
    setTotalArrival(totalArrivalTimeString);

    // الحصول على الوقت الحالي
    const currentTime = new Date();
    // إضافة الوقت المقدر للوصول إلى الوقت الحالي
    let estimatedArrivalTime = new Date(currentTime.getTime() + totalArrivalTimeInSeconds * 1000);
    // التحقق مما إذا كانت الوصول المتوقع يتجاوز يوم الحالي
    if (estimatedArrivalTime.getDate() !== currentTime.getDate()) {
        // إذا كانت التاريخ المتوقع للوصول يتجاوز يوم الحالي، قم بزيادة عدد الأيام بشكل مناسب
        const daysDifference = estimatedArrivalTime.getDate() - currentTime.getDate();
        estimatedArrivalTime.setDate(estimatedArrivalTime.getDate() + daysDifference);
    }
    // تنسيق الزمن لعرضه بالساعات والدقائق
    const formattedEstimatedArrivalTime = `${estimatedArrivalTime.getHours()}:${String(estimatedArrivalTime.getMinutes()).padStart(2, '0')}`;
    console.log("currentTime::: ", typeof(currentTime), currentTime);
    console.log("formattedEstimatedArrivalTime::: ", typeof(formattedEstimatedArrivalTime), formattedEstimatedArrivalTime);
    console.log("totalArrivalTimeString::: ", typeof(totalArrivalTimeString), totalArrivalTimeString);
    console.log("estimatedArrivalTime::: ", typeof(estimatedArrivalTime), estimatedArrivalTime);
    // تحديث الحالة في NavigationBarB عند النقر على "Vorschau"
    //setIsPreviewVisible(true);
    // تحديث الزمن المعروض في الزر
    setTimeArrival(formattedEstimatedArrivalTime);
}, [groupedItemsScanned]);


const formattedTime = (t)=> {
  const doneTime = new Date(t * 1000).toISOString();
  console.log("doneTime::: ", doneTime); // ستحصل على تاريخ مشابه لـ "2021-07-28T12:32:06"
  // القيام بالاقتطاع للحصول على الجزء المطلوب بتنسيق "03:24:17"
  const result = doneTime.substring(11, 19);
  console.log("result::: ", result);
  return result
}

const handlePreviewPress = () => {
  console.log("groupedItemsScanned::: ", groupedItemsScanned);
  setIsPreviewVisible(true);
  // تحديث الحالة في NavigationBarB عند النقر على "Vorschau"
};
/* const handleDriveMap = () => {
  setIsPreviewVisible(false);
  dispatch(addToInvoices(optimizedInvoicesToDispatch));
  
  navigate('/tour');
}; */
const handleDriveList = () => {
  setIsPreviewVisible(false);
  dispatch(addToKassa(optimizedInvoicesToDispatch));
  
  navigate('/tourlist');
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
      <div className={`bg-[#14193318] lg:pr-36 lg:pl-36 md:pr-24 md:pl-24 p-5 ${isScanned && "pb-14"}`}>
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
          >
            <div className="rounded-xl sa-bg-main-dark-transparent px-2 py-2 h-[65vh]" style={{overflowY: 'scroll' }}>
              <div className="items-center">
                {invoiceData.length !== 0 ? (
                  invoiceData.map((invoice, index) => {
                    return (
                      <div key={index}>
                        {invoice.lat && invoice.lon ? (
                          <CustomerRow
                            key={invoice.bearbeitung_lfdnr}
                            id={Number(invoice.bearbeitung_lfdnr)}
                            name={index + 1 + ". " + invoice.name1}
                            description={" " + invoice.belegnummer}
                            name2={invoice.name2}
                            price={Number(invoice.brutto)}
                            customerImg="https://transfer.klein-autoteile.at/aussendienst/safwan/naviAssets/images/noimg.png"
                            customerAddress={" " + invoice.strasse + " ,\n" + invoice.plz + " " + invoice.ort}
                            //lat={Number(invoice.lat)}
                            //lon={Number(invoice.lon)}
                            removeItemFromInvoiceData={() => removeItemFromInvoiceData(invoice)}
                            items={invoiceData}
                          />
                        ) : (
                          // عرض alert بشرط التحقق من عدم عرضه بالفعل
                          !invoice.warningDisplayed && (alert(
                            `Achtung: Die Lieferscheine:  ${invoice.bearbeitung_lfdnr}*001#  hat keine gültige Adresse.\nBitte wenden Sie sich an die Filiale, um die Adresse in V5 zu korrigieren`), 
                            invoice.warningDisplayed = true)
                        )}
                      </div>
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
            title={`Vorschau(${optimizedInvoices.length})⏱️Dauer: ${totalArrival}⏰Endeszeit: ${timeArrival}`}
            onPress={handlePreviewPress}
          />
        )}
        {isPreviewVisible && (
            <div className="flex-1 fixed top-0 left-0 right-0 bottom-0 justify-between items-center py-6 px-6 bg-[#141933]">
              <div className= "sa-bg-main-dark-transparent rounded-lg px-3 py-3" >
                <PreviewModal
                  groupedItemsScanned={groupedItemsScanned}
                  removeItemFromInvoiceData={removeItemFromInvoiceData}
                  isPressed={isPressed}
                  toggleIsPressed={toggleIsPressed}
                />
                <div className={`flex flex-row bg-[#14193318] rounded-2xl `}>
                  <ButtonPrimary
                    style={{ marginBottom: 28 }}
                    title={`Fortsetzen`}
                    onPress={() => {setIsPreviewVisible(false);}}
                  />
                  {/* <ButtonPrimary
                    style={{ marginBottom: 28 }}
                    title={`Go-Map`}
                    onPress={handleDriveMap}
                  /> */}
                  <ButtonPrimary
                    style={{ marginBottom: 28 }}
                    title={`Go-List`}
                    onPress={handleDriveList}
                  />
                </div>
              </div>
            </div>
        )}
      </div>
    </div>
  )
}

export default Kassa;