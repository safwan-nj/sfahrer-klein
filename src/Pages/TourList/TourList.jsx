import './TourList.css';
import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectInvoicesItems, markInvoiceAsSaved } from '../../Redux/invoicesSlice';
import { selectuserLocationItems } from '../../Redux/userLocationSlice';
import { useNavigate } from 'react-router-dom';
import { ButtonPrimary, Camera, CardList, CustomerOptions } from '../../Components';
import Sign from '../../Components/CustomerSignature/Sign';
import { GetCurrentCoordinates, GetLocalStorageItems } from '../../Services';
import axios from 'axios';
import * as FaIcons from 'react-icons/fa6';

// --- تعديل: تغيير المخزن إلى sessionStorage للحفاظ على بيانات الجلسة الحالية فقط ---
const getCompletedFromStorage = () => {
  try {
    const items = sessionStorage.getItem('completedTourLsNumbers');
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error("Error reading from sessionStorage", error);
    return [];
  }
};

function TourList() {
  const dispatch = useDispatch();
  const invoicesData = useSelector(selectInvoicesItems);
  const userLocationData = useSelector(selectuserLocationItems);
  const [groupedItemsInBasket, setGroupedItemsInBasket] = useState([]);
  const [showSign, setShowSign] = useState(false);
  const [showCam, setShowCam] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mapLink, setMapLink] = useState('');
  const [myLongitude, setMyLongitude] = useState(null);
  const [myLatitude, setMyLatitude] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [cameraImageUri, setCameraImageUri] = useState(null);
  const [isDataReady, setIsDataReady] = useState(false);
  const [sign, setSign] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [devName, setDevName] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [itemsLength, setItemsLength] = useState(0);
  const [fullscreenEntered, setFullscreenEntered] = useState(false);
  const [isModalExiting, setIsModalExiting] = useState(false);
  const [customAlert, setCustomAlert] = useState({ show: false, message: '', onConfirm: null, type: 'fullscreen' });
  
  const [completedItems, setCompletedItems] = useState(getCompletedFromStorage());

  const navigate = useNavigate();

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

  const CustomAlert = ({ message, onConfirm, type }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="sa-bg-transparent rounded-lg p-4 text-white">
        <h2 className="text-2xl font-bold text-center pb-4">Achtung!</h2>
        <p>{message}</p>
        <div className="flex justify-end mt-4 gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onConfirm}>
            OK
          </button>
        </div>
      </div>
    </div>
  );

  const flatInvoiceData = useMemo(() => invoicesData.flat(), [invoicesData]);
  console.log('invoicesData from TourList::: ', invoicesData);

  const formatedData = useMemo(() => {
    return flatInvoiceData
      // .filter((item) => !item.is_saved) 
      .map((item) => ({
        address: `${item.strasse}, ${item.plz} ${item.ort}`,
        id: item.bearbeitung_lfdnr,
        image: 'https://transfer.klein-autoteile.at/aussendienst/safwan/naviAssets/images/noimg.png',
        key: item.bearbeitung_lfdnr,
        lat: parseFloat(item.lat),
        location: [parseFloat(item.lon), parseFloat(item.lat)],
        lon: parseFloat(item.lon),
        ls: item.bearbeitung_lfdnr,
        price: parseFloat(item.brutto),
        title: item.name1,
        devName: item.devName,
        arrival: item.arrival,
        plz: item.plz,
        ort: item.ort,
        strasse: item.strasse,
        land: item.land,
        kontonr: item.kontonr,
      }));
  }, [flatInvoiceData]);

  useEffect(() => {
    if (invoicesData.length === 0) {
      const confirmation = window.confirm(
        'Die Seite wurde falsch navigiert, da keine Daten vorhanden sind. Klicken Sie auf OK, um zur Startseite zurückzukehren.'
      );
      if (confirmation) {
        window.location.href = '/';
      }
    }

    const disableBackButton = () => {
      navigate(1);
    };

    window.history.pushState({}, '');
    window.addEventListener('popstate', disableBackButton);

    return () => {
      window.removeEventListener('popstate', disableBackButton);
    };
  }, [navigate, invoicesData]);

  useEffect(() => {
    const groupedItems = formatedData.reduce((results, item) => {
        const existingItem = results.find(
          (result) => result.lat === item.lat && result.lon === item.lon && result.kontonr === item.kontonr
        );
        if (existingItem) {
          if (!Array.isArray(existingItem.ls)) existingItem.ls = [existingItem.ls];
          if (!Array.isArray(existingItem.id)) existingItem.id = [existingItem.id];
          if (!Array.isArray(existingItem.key)) existingItem.key = [existingItem.key];
          if (!Array.isArray(existingItem.price)) existingItem.price = [existingItem.price];
          
          existingItem.id.push(item.id);
          existingItem.key.push(item.key);
          existingItem.ls.push(item.ls);
          existingItem.price.push(item.price);
        } else {
          results.push({
            ...item,
            id: [item.id],
            key: [item.key],
            ls: [item.ls],
            price: [item.price],
          });
        }
        return results;
      }, []);

    const groupedItemsWithIndex = groupedItems.map((item, index) => ({
      ...item,
      itemIndex: index + 1,
    }));

    setGroupedItemsInBasket(groupedItemsWithIndex.reverse());
    setItemsLength(groupedItemsWithIndex.length);
  }, [formatedData]);

  useEffect(() => {
    if (groupedItemsInBasket.length > 0 && userLocationData[0]?.lat && userLocationData[0]?.long) {
      const reshapedItemsForLink = reshapeItemsForLink(groupedItemsInBasket);
      const linkMap = `https://transfer.klein-autoteile.at/aussendienst/safwan/safimaps/v3/?searchtools=false&query=${encodeURIComponent(
        JSON.stringify(reshapedItemsForLink)
      )}&zoom=6&mode=map&userLocation=${encodeURIComponent(
        JSON.stringify({ lat: userLocationData[0].lat, lon: userLocationData[0].long })
      )}`;
      setMapLink(linkMap);
    }
  }, [groupedItemsInBasket, userLocationData]);

  useEffect(() => {
    let timeout;
    if (isDataReady) {
      timeout = setTimeout(() => {
        saveSignature();
        setIsDataReady(false);
      }, 0);
    }
    return () => clearTimeout(timeout);
  }, [isDataReady]);

  useEffect(() => {
    GetCurrentCoordinates()
      .then(({ latitude, longitude }) => {
        const deviceName = GetLocalStorageItems('device_id');
        setLongitude(longitude);
        setLatitude(latitude);
        setDevName(deviceName);
      })
      .catch((error) => {
        console.error('Error getting current coordinates:', error.message);
      });
  }, []);

  useEffect(() => {
    if (isModalExiting) {
      const timer = setTimeout(() => {
        setShowModal(false);
        setShowSign(false);
        setShowCam(false);
        setIsModalExiting(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isModalExiting]);

  const reshapeItemsForLink = (items) => {
    return items.map((item) => {
      // محاولة بسيطة لفصل رقم المنزل، قد تحتاج لتحسينها حسب بياناتك
      const streetParts = item.strasse?.match(/(.*?)\s*([\d\w/.-]+)$/) || [];
      const streetName = streetParts[1] ? streetParts[1].trim() : (item.strasse || '');
      const houseNumber = streetParts[2] || '';

      return {
        street: streetName,
        state: item.ort || '',
        country: item.land || '',
        postalcode: item.plz || '',
        housenumber: houseNumber,
        display_name: item.title || '',
      };
    });
  };

  const handleCardChange = (index) => {
    setActiveCardIndex(index + 1);
  };

  const onGoClick = async (item) => {
    setActiveItem(item);
    await fetchDataOnClick();
    let roundLat = parseFloat(item.lat);
    let roundLon = parseFloat(item.lon);
    if (isNaN(roundLat) || isNaN(roundLon)) {
      console.error('Invalid latitude or longitude');
      return;
    }

    const googleMapOpenUrl = ({ latitude, longitude }) => {
      const destLatLng = `${latitude},${longitude}`;
      let orgLatLng = '';
      if (myLatitude !== null && myLongitude !== null) {
        orgLatLng = `${myLatitude},${myLongitude}`;
      }
      return `https://www.google.com/maps/dir/?api=1&destination=${destLatLng}&origin=${orgLatLng}&dir_action=navigate&dirflg=w`;
    };

    const mapLink = googleMapOpenUrl({ latitude: roundLat, longitude: roundLon });
    window.open(mapLink, '_blank');
  };

  const fetchDataOnClick = async () => {
    try {
      const locationPermission = await navigator.permissions.query({ name: 'geolocation' });
      if (locationPermission.state === 'granted' || locationPermission.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setMyLongitude(longitude);
            setMyLatitude(latitude);
          },
          (error) => {
            console.error('Error getting location:', error.message);
          }
        );
      } else {
        console.error('Geolocation permission denied');
      }
    } catch (error) {
      console.error('Error checking geolocation permission:', error.message);
    }
  };

  const onOptionsClick = (item, index) => {
    setShowModal(true);
    setShowSign(false);
    setShowCam(false);
    setActiveItem(item);
    setActiveCardIndex(index + 1);
  };

  const onClose = () => {
    setIsModalExiting(true);
  };

  // --- تعديل: استخدام sessionStorage للحفظ ---
  const updateCompletionStatus = () => {
    if (Array.isArray(activeItem?.ls)) {
      activeItem.ls.forEach((lsElement) => {
        dispatch(markInvoiceAsSaved({ ls: lsElement }));
      });
      const newCompleted = [...new Set([...completedItems, ...activeItem.ls])];
      setCompletedItems(newCompleted);
      sessionStorage.setItem('completedTourLsNumbers', JSON.stringify(newCompleted));
    }
  };

  const handleSign = () => {
    setShowSign(true);
    setShowModal(false);
    setShowCam(false);
    updateCompletionStatus();
  };
  
  const handleCam = () => {
    setShowCam(true);
    setShowSign(false);
    setShowModal(false);
    updateCompletionStatus();
  };

  const handleSelectedOptionChange = (option) => {
    setSelectedOption(option);
  };

  const onTakePhoto = (dataUri) => {
    setCameraImageUri(dataUri);
    setSign('');
  };

  const onAcceptPhoto = () => {
    setIsDataReady(true);
    setShowCam(false);
  };

  const onSignature = (signature, name) => {
    const jsonName = JSON.stringify(name);
    setSign(signature);
    setCameraImageUri('');
    setCustomerName(jsonName.replace(/"/g, ''));
    setIsDataReady(true);
    setShowSign(false);
  };

  const saveSignature = async () => {
    await fetchDataOnClick();
    if (sign === '' && cameraImageUri === '') {
      alert('Bitte ergänzen Sie die fehlenden Angaben (Unterschrift oder Foto');
      return;
    }

    const randomOffset = () => Math.random() * 0.00001 - 0.000005;

    if (Array.isArray(activeItem?.ls)) {
      for (const lsElement of activeItem.ls) {
        let dataArray = {
          ls: lsElement,
          lieferart: selectedOption,
          signatur: sign,
          lat: activeItem?.lat ? (parseFloat(activeItem.lat) + randomOffset()).toFixed(7) : latitude,
          lon: activeItem?.lon ? (parseFloat(activeItem.lon) + randomOffset()).toFixed(7) : longitude,
          devicename: devName,
          signatur_name: customerName,
          foto: cameraImageUri,
        };

        await saveToDb(dataArray);
      }
      alert('Saved');
    } else {
      console.error('item.ls is not an array:', activeItem?.ls);
    }
  };

  const saveToDb = async (data) => {
    let headersList = {
      'Content-Type': 'application/json',
    };

    let reqOptions = {
      url: 'https://transfer.klein-autoteile.at/aussendienst/safwan/naviAssets/web_services/insert.php?action=navi_ablieferung',
      method: 'POST',
      headers: headersList,
      data: data,
    };

    try {
      const response = await axios.request(reqOptions);
      console.log('response::: ', response.data);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="app-container">
      <div className="sa-bg-main-light card-list-container">
        {groupedItemsInBasket.map((item, index) => {
          const isItemCompleted = item.ls.some(ls => completedItems.includes(ls));
          
          return (
            <CardList
              countLength={itemsLength}
              key={item.key.join('-')}
              id={index}
              name={item.title}
              address={item.address}
              imageUrl={item.image}
              img={item.screenImg || ''}
              lat={item.lat}
              lon={item.lon}
              ls={item.ls}
              price={item.price}
              devId={item.devName}
              arrival={item.arrival}
              item={item}
              onGoClick={() => onGoClick(item)}
              onOptionsClick={() => onOptionsClick(item, index)}
              isActive={index === activeCardIndex}
              onChange={() => handleCardChange(index)}
              isCompleted={isItemCompleted}
            />
          );
        })}
        <h1 className="text-gray-500 text-sm m-4">
          Bitte klicken Sie einfach auf diese Schaltfläche, wenn Sie fertig sind. Sobald Sie auf die Schaltfläche klicken, werden alle Daten gelöscht.
        </h1>
        <ButtonPrimary
          title="Zurück zur Filiale"
          tcolor="sa-text-main-light"
          onPress={() => {
            const confirmation = window.confirm(
              'Alle Daten werden gelöscht, sobald Sie auf die Schaltfläche klicken. Sind Sie sicher, dass Sie fortfahren möchten?'
            );
            if (confirmation) {
              // --- تعديل: مسح البيانات من sessionStorage عند انتهاء الجلسة ---
              sessionStorage.removeItem('completedTourLsNumbers');
              navigate('/final');
            }
          }}
          specClass="sa-bg-done-transparent w-[96%] rounded-full py-3 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />
      </div>

      {(showModal || showSign || showCam) && (
        <div className={`modal-container ${isModalExiting ? 'slide-up' : 'slide-down'}`}>
          {showModal && !showSign && !showCam && (
            <CustomerOptions
              onSign={handleSign}
              onCam={handleCam}
              customerItem={activeItem}
              exitSign={onClose}
              handleSelectedOptionChange={handleSelectedOptionChange}
            />
          )}

          {showSign && !showModal && !showCam && <Sign exitSign={onClose} onSignature={onSignature} />}

          {showCam && !showModal && !showSign && (
            <Camera className="mx-auto" onTakePhoto={onTakePhoto} onAcceptPhoto={onAcceptPhoto} exitCam={onClose} />
          )}
        </div>
      )}

      {customAlert.show && (
        <CustomAlert message={customAlert.message} onConfirm={customAlert.onConfirm} type={customAlert.type} />
      )}
    </div>
  );
}

export default TourList;