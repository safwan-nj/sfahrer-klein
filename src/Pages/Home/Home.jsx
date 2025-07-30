import * as FaIcons from 'react-icons/fa';
import { ButtonPrimary, InputPrimary, CustomerRow, PreviewModal } from '../../Components';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addToInvoices, clearAllInvoices } from '../../Redux/invoicesSlice';
import { addTouserLocation, clearAlluserLocation } from '../../Redux/userLocationSlice';
import { AxiosConnect, CreateJobs, GetCurrentCoordinates, GetLocalStorageItems, OptimizerConnect } from '../../Services';
import moment from 'moment';
import axios from 'axios';
import './Home.css';

function Home() {
  const ref = useRef();
  const scrollViewRef = useRef();
  const [invoiceCode, setInvoiceCode] = useState('');
  const [invoiceData, setInvoiceData] = useState([]);
  const [isScanned, setIsScanned] = useState(false);
  const [isPressed, setIsPressed] = useState({});
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const defaultLat = 47.793682496234;
  const defaultLng = 12.989697049214;
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
  const [isModalExiting, setIsModalExiting] = useState(false);
  const [devName, setDevName] = useState("");
  const [fullscreenEntered, setFullscreenEntered] = useState(false);
  const [customAlert, setCustomAlert] = useState({ show: false, message: "", onConfirm: null, type: "default" });
  const [addressInputModal, setAddressInputModal] = useState({ show: false, invoice: null });
  const [showKeyboard, setShowKeyboard] = useState(false); // حالة للتحكم في إظهار لوحة المفاتيح
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const organizedData = CreateJobs(invoiceData, longitude, latitude);

  // مستمع لدخول وضع ملء الشاشة عند النقر
  useEffect(() => {
    const enterFullscreen = () => {
      const element = document.documentElement;
      if (!fullscreenEntered && !document.fullscreenElement) {
        try {
          element.requestFullscreen();
          setFullscreenEntered(true);
        } catch (error) {
          console.error('Failed to enter fullscreen mode:', error);
        }
      }
    };

    document.addEventListener('click', enterFullscreen);

    return () => {
      if (document.fullscreenElement === document.documentElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
      document.removeEventListener('click', enterFullscreen);
    };
  }, [fullscreenEntered]);

  // مستمع للتحقق من التركيز ووضع ملء الشاشة كل 10 ثوان
  useEffect(() => {
    const checkFocusAndFullscreen = () => {
      // التحقق من التركيز
      if (document.activeElement !== ref.current && !isPreviewVisible && ref.current && !addressInputModal.show) {
        ref.current.focus();
      }
  
      // التحقق من وضع ملء الشاشة
      /* if (!document.fullscreenElement && !customAlert.show) {
        setCustomAlert({
          show: true,
          message: "Bitte wechseln Sie in den Vollbildmodus, um fortzufahren.",
          onConfirm: () => {
            const element = document.documentElement;
            try {
              element.requestFullscreen().then(() => {
                // نجاح الدخول إلى ملء الشاشة، إغلاق الرسالة تلقائيًا
                setFullscreenEntered(true);
                setCustomAlert({ show: false, message: "", onConfirm: null, type: "default" });
                if (ref.current) {
                  ref.current.focus();
                }
              });
            } catch (error) {
              console.error('Failed to enter fullscreen mode:', error);
            }
          },
          type: "fullscreen"
        });
      } */
    };
  
    // تشغيل الفحص الأولي
    checkFocusAndFullscreen();
  
    // تشغيل الفحص كل 10 ثوان
    const intervalId = setInterval(checkFocusAndFullscreen, 5000);
  
    return () => clearInterval(intervalId);
  }, [isPreviewVisible, customAlert.show, addressInputModal.show]);

  // مكون النافذة المنبثقة المخصصة
  const CustomAlert = ({ message, onConfirm, onManualAddress, type }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="sa-bg-transparent rounded-lg p-4 text-white">
        <h2 className="text-2xl font-bold text-center pb-4">Achtung!</h2>
        <p>{message}</p>
        <div className="flex justify-end mt-4 gap-2">
          {type === "address" && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={onManualAddress}
            >
              Adresse manuell eingeben
            </button>
          )}
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );

  // مكون نافذة إدخال العنوان يدويًا
  const AddressInputModal = ({ invoice, onSubmit, onCancel }) => {
    const [street, setStreet] = useState('');
    const [zip, setZip] = useState('');
    const [city, setCity] = useState('');

    const handleSubmit = () => {
      if (street && zip && city) {
        onSubmit({ street, zip, city });
      } else {
        alert('Bitte füllen Sie alle Felder aus.');
      }
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
        <div className="sa-bg-transparent rounded-lg p-4 text-white w-11/12 max-w-md">
          <h2 className="text-2xl font-bold text-center pb-4">Adresse manuell eingeben</h2>
          <div className="flex flex-col gap-4">
            <InputPrimary
              type="text"
              value={street}
              placeholder="Straße"
              onChange={(e) => setStreet(e.target.value)}
              className="w-full"
            />
            <InputPrimary
              type="text"
              value={zip}
              placeholder="PLZ"
              onChange={(e) => setZip(e.target.value)}
              className="w-full"
            />
            <InputPrimary
              type="text"
              value={city}
              placeholder="Ort"
              onChange={(e) => setCity(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleSubmit}
            >
              Bestätigen
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={onCancel}
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    );
  };

  // تحديث الموقع عند فتح التطبيق
  useEffect(() => {
    const originalPath = document.referrer;
    localStorage.setItem('originalPath', originalPath);
  }, [location]);

  // الحصول على إحداثيات الجهاز واسم الجهاز
  useEffect(() => {
    GetCurrentCoordinates().then(({ latitude, longitude }) => {
      const deviceName = GetLocalStorageItems('device_id');
      setLongitude(longitude);
      setLatitude(latitude);
      dispatch(clearAllInvoices());
      dispatch(clearAlluserLocation());
      dispatch(addTouserLocation({ lat: latitude, long: longitude }));
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

  // تحسين البيانات وتعيين قوائم العمل
  useEffect(() => {
    if (organizedData.jobs.length > 0) {
      OptimizerConnect(organizedData)
        .then((response) => {
          const jobItems = response.routes[0].steps.filter(item => item.type === "job");
          const startTour = response.routes[0].steps.filter(item => item.type === "start");
          const endTour = response.routes[0].steps.filter(item => item.type === "end");
          setJobList(jobItems);
          setStartPointOfTheTour(startTour);
          setEndPointOfTheTour(endTour);
          const filteredInvoiceData = invoiceData.filter(invoice => !isNaN(Number(invoice.lon)) && !isNaN(Number(invoice.lat)));
          const newInvoiceData = filteredInvoiceData.map((invoice, index) => ({ id: index + 1, ...invoice }));
          const sortedNewInvoiceData = newInvoiceData.sort((a, b) => {
            const idA = jobItems.findIndex(item => item.id === a.id);
            const idB = jobItems.findIndex(item => item.id === b.id);
            return idA - idB;
          });
          sortedNewInvoiceData.forEach(item => {
            item.devName = devName;
          });
          setOptimizedInvoices(sortedNewInvoiceData);
        })
        .catch((error) => {
          console.log("error::: ", JSON.stringify(error));
        });
    }
  }, [invoiceData]);

  // حساب المجموع الكلي للبرتو
  useEffect(() => {
    let sum = 0;
    for (const invoice of optimizedInvoices) {
      const brutto = parseFloat(invoice.brutto);
      if (!isNaN(brutto)) {
        sum += brutto;
      }
    }
    const formattedTotalBrutto = sum.toFixed(2).replace('.', ',');
    setTotalBrutto(formattedTotalBrutto);
  }, [optimizedInvoices]);

  // تجميع العناصر بناءً على الاسم
  useEffect(() => {
    const groupedItems = optimizedInvoices.reduce((results, item) => {
      const matchingJob = jobList.find((job) => job.id === item.id);
      if (!matchingJob) {
        return results;
      }
      const arrivalTime = formattedTime(matchingJob.arrival);
      const key = `${item.lat},${item.lon}, ${item.kontonr}`;
      (results[key] = results[key] || []).push({ ...item, arrival: arrivalTime });
      return results;
    }, {});

    const optimizedItems = optimizedInvoices.reduce((results, item) => {
      const matchingJob = jobList.find((job) => job.id === item.id);
      if (!matchingJob) {
        return [...results];
      }
      const arrivalTime = formattedTime(matchingJob.arrival);
      return [...results, { ...item, arrival: arrivalTime }];
    }, []);

    optimizedItems.startPointOfTheTour = startPointOfTheTour;
    optimizedItems.endPointOfTheTour = endPointOfTheTour;
    setOptimizedInvoicesToDispatch(optimizedItems);
    setGroupedItemsScanned(groupedItems);

    console.log("Grouped Items Scanned: ", groupedItems);
    console.log("Optimized Invoices to Dispatch: ", optimizedItems);
  }, [optimizedInvoices]);

  // معالجة رمز الفاتورة
  useEffect(() => {
    if (invoiceCode.length === 13 && invoiceCode !== "undefined" && invoiceCode !== '') {
      let slicedInvoiceCode = invoiceCode.slice(0, -5);
      AxiosConnect('POST', "navi_belegdaten", devName, slicedInvoiceCode)
        .then((response) => {
          if (response && response[0]) {
            setInvoiceData((prevState) => {
              const currentTime = moment().format('hh:mm a');
              const existingInvoice = prevState.find(
                (invoice) => invoice.bearbeitung_lfdnr === response[0].bearbeitung_lfdnr
              );
              if (existingInvoice) {
                return prevState.map((invoice) =>
                  invoice.bearbeitung_lfdnr === response[0].bearbeitung_lfdnr
                    ? { ...response[0], currentTime }
                    : invoice
                );
              }
              return [
                {
                  ...response[0],
                  currentTime: currentTime,
                },
                ...prevState,
              ];
            });
            setIsScanned(true);
            setInvoiceCode('');
          } else {
            alert(
              'Sie haben einen falschen Scan durchgeführt.\nBitte überprüfen Sie den Barcode und versuchen Sie es erneut',
            );
            setInvoiceCode('');
          }
        })
        .catch((error) => {
          console.log(error);
          alert(
            'Error',
            'Beim Abrufen der Daten ist ein Fehler aufgetreten. Bitte überprüfen Sie الرقم وجرب مرة أخرى.',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
          );
        });
    }
  }, [invoiceCode]);

  // حساب وقت الوصول الكلي
  useEffect(() => {
    const processedNames = [];
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

    const totalHours = Math.floor(totalArrivalTimeInSeconds / 3600);
    const totalMinutes = Math.floor((totalArrivalTimeInSeconds % 3600) / 60);
    const totalSeconds = totalArrivalTimeInSeconds % 60;
    const totalArrivalTimeString = `${totalHours}:${totalMinutes}`;
    setTotalArrival(totalArrivalTimeString);

    const currentTime = new Date();
    let estimatedArrivalTime = new Date(currentTime.getTime() + totalArrivalTimeInSeconds * 1000);
    if (estimatedArrivalTime.getDate() !== currentTime.getDate()) {
      const daysDifference = estimatedArrivalTime.getDate() - currentTime.getDate();
      estimatedArrivalTime.setDate(estimatedArrivalTime.getDate() + daysDifference);
    }
    const formattedEstimatedArrivalTime = `${estimatedArrivalTime.getHours()}:${String(estimatedArrivalTime.getMinutes()).padStart(2, '0')}`;
    setTimeArrival(formattedEstimatedArrivalTime);
  }, [groupedItemsScanned]);

  const formattedTime = (t) => {
    const doneTime = new Date(t * 1000).toISOString();
    const result = doneTime.substring(11, 19);
    return result;
  };

  const handlePreviewPress = () => {
    setIsModalExiting(false);
    setIsPreviewVisible(true);
  };

  const handleClosePreview = () => {
    setIsModalExiting(true);
  };

  const handleDriveMap = () => {
    setIsPreviewVisible(false);
    dispatch(addToInvoices(optimizedInvoicesToDispatch));
    navigate('/tour');
  };

  const handleDriveList = () => {
    setIsPreviewVisible(false);
    dispatch(addToInvoices(optimizedInvoicesToDispatch));
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

  const errorLogToDb = (data) => {
    let headersList = {
      "Content-Type": "application/json",
    };

    let reqOptions = {
      url: "https://transfer.klein-autoteile.at/aussendienst/safwan/naviAssets/web_services/insert.php?action=navi_error_log",
      method: "POST",
      headers: headersList,
      data: data,
    };

    axios.request(reqOptions)
      .then((response) => {
        console.log("response::: ", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleManualAddress = (invoice) => {
    setCustomAlert({ show: false, message: "", onConfirm: null, type: "default" });
    setAddressInputModal({ show: true, invoice });
  };

  const handleAddressSubmit = ({ street, zip, city }) => {
    setInvoiceData((prevState) => {
      const updatedInvoiceData = prevState.map((item) => {
        if (item.bearbeitung_lfdnr === addressInputModal.invoice.bearbeitung_lfdnr) {
          return {
            ...item,
            strasse: street,
            plz: zip,
            ort: city,
            lat: defaultLat,
            lon: defaultLng,
            warningDisplayed: true,
          };
        }
        return item;
      });
      return updatedInvoiceData;
    });
    setAddressInputModal({ show: false, invoice: null });
  };

  const handleShowKeyboard = () => {
    setShowKeyboard(true);
    if (ref.current) {
      ref.current.focus();
    }
  };

  useEffect(() => {
    invoiceData.forEach((invoice) => {
      if (!invoice.lat && !invoice.lon && !invoice.warningDisplayed && !customAlert.show && !addressInputModal.show) {
        setCustomAlert({
          show: true,
          message: `Achtung: Die Lieferscheine: ${invoice.belegnummer}*001# hat keine gültige Adresse.\nBitte wenden Sie sich an die Filiale, um die Adresse in V5 zu korrigieren.\nMöchten Sie die Adresse manuell eingeben?`,
          onConfirm: () => {
            setCustomAlert({ show: false, message: "", onConfirm: null, type: "default" });
            setInvoiceData((prevState) => {
              const updatedInvoiceData = prevState.filter(
                (item) => item.bearbeitung_lfdnr !== invoice.bearbeitung_lfdnr
              );
              return updatedInvoiceData;
            });
            errorLogToDb({
              "ls": invoice.bearbeitung_lfdnr,
              "device_id": devName,
              "error_log": "Address not valid"
            });
          },
          onManualAddress: () => handleManualAddress(invoice),
          type: "address"
        });
      }
    });
  }, [invoiceData]);

  useEffect(() => {
    if (isModalExiting) {
      const timer = setTimeout(() => {
        setIsPreviewVisible(false);
        setIsModalExiting(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isModalExiting]);

  return (
    <div className='home h-full'>
      <div className={`sa-bg-main-light lg:pr-36 lg:pl-36 md:pr-24 md:pl-24 p-3 ${isScanned && "pb-14"}`}>
        <div className="relative">
          <div className="flex-row">
            <div className="flex-row flex-1 items-center rounded-full sa-bg-main-dark-transparent py-2">
              <div className="flex items-center w-full relative">
                <p className='ml-2 text-xs font-semibold sa-text-main-secondary'>Home:</p>
                <FaIcons.FaSistrix className="sa-text-main-dark w-6 h-6 m-2" />
                <InputPrimary
                  innerRef={ref}
                  type="text"
                  maxLength={13}
                  value={invoiceCode}
                  autoFocus={true}
                  className="w-screen rounded-full mr-12"
                  placeholder="LS. QR-Code scannen"
                  onChange={(e) => setInvoiceCode(e.target.value)}
                  inputMode={showKeyboard ? "text" : "none"}
                  roundSet="rounded-full"
                />
                <button
                  onClick={handleShowKeyboard}
                  className="absolute right-2 p-2 sa-bg-main-secondary rounded-full text-white"
                  title="Tastatur anzeigen"
                >
                  <FaIcons.FaKeyboard className="w-5 h-5" />
                </button>
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
          <div ref={scrollViewRef} className="h-full">
            <div className="rounded-xl sa-bg-main-dark-transparent px-2 py-2 h-[65vh]" style={{ overflowY: 'scroll' }}>
              <div className="items-center">
                {invoiceData.length !== 0 ? (
                  invoiceData.map((invoice, index) => (
                    <div key={index}>
                      {invoice.lat && invoice.lon ? (
                        <CustomerRow
                          key={invoice.bearbeitung_lfdnr}
                          id={Number(invoice.bearbeitung_lfdnr)}
                          name={invoice.name1}
                          description={" " + invoice.belegnummer}
                          name2={invoice.name2}
                          price={Number(invoice.brutto)}
                          customerImg="https://transfer.klein-autoteile.at/aussendienst/sვ://safwan/naviAssets/images/noimg.png"
                          customerAddress={" " + invoice.strasse + " ,\n" + invoice.plz + " " + invoice.ort}
                          removeItemFromInvoiceData={() => removeItemFromInvoiceData(invoice)}
                          items={invoiceData}
                        />
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="text-xsm text-center text-gray-400">No Data</p>
                )}
              </div>
            </div>
          </div>
        )}
        {optimizedInvoices.length > 0 && (
          <div
            className='sa-bg-main-dark-transparent rounded-2xl'
            style={{
              backgroundColor: "white",
              padding: 2,
              borderRadius: 20,
              marginTop: 10,
              width: "100%",
            }}
          >
            <p className='text-emerald-950 text-sm text-center mt-2 mb-0 font-semibold'>
              ⏱️Dauer: {totalArrival}⏰Endeszeit: {timeArrival}
            </p>
            <ButtonPrimary
              title={`Vorschau ( ${optimizedInvoices.length} Aufträge )`}
              onPress={handlePreviewPress}
            />
          </div>
        )}
        {isPreviewVisible && (
          <div className={`flex-1 fixed top-0 left-0 right-0 bottom-0 justify-between items-center sa-bg-main-light-transparent h-full w-full ${isModalExiting ? 'slide-up' : 'slide-down'}`}>
            <div className="sa-bg-main-dark px-3 py-5 w-full h-full">
              <PreviewModal
                groupedItemsScanned={groupedItemsScanned}
                removeItemFromInvoiceData={removeItemFromInvoiceData}
                isPressed={isPressed}
                toggleIsPressed={toggleIsPressed}
              />
              <div className={`flex flex-row sa-bg-main-light-transparent rounded-2xl fixed bottom-0 left-0 right-0 py-2 px-2`}>
                <ButtonPrimary
                  title={`Fortsetzen`}
                  onPress={handleClosePreview}
                />
                <ButtonPrimary
                  title={`Losfahren`}
                  onPress={handleDriveList}
                />
              </div>
            </div>
          </div>
        )}
        {customAlert.show && (
          <CustomAlert
            message={customAlert.message}
            onConfirm={customAlert.onConfirm}
            onManualAddress={customAlert.onManualAddress}
            type={customAlert.type}
          />
        )}
        {addressInputModal.show && (
          <AddressInputModal
            invoice={addressInputModal.invoice}
            onSubmit={handleAddressSubmit}
            onCancel={() => {
              setAddressInputModal({ show: false, invoice: null });
              setInvoiceData((prevState) => {
                const updatedInvoiceData = prevState.filter(
                  (item) => item.bearbeitung_lfdnr !== addressInputModal.invoice.bearbeitung_lfdnr
                );
                return updatedInvoiceData;
              });
              errorLogToDb({
                "ls": addressInputModal.invoice.bearbeitung_lfdnr,
                "device_id": devName,
                "error_log": "Address not valid"
              });
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Home;