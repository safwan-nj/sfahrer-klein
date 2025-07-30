import './TourList.css';
import  { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectInvoicesItems } from '../../Redux/invoicesSlice';
import { selectuserLocationItems } from '../../Redux/userLocationSlice';
import { useNavigate } from 'react-router-dom';
import { Camera, CardList, CustomerOptions } from '../../Components';
import Sign from '../../Components/CustomerSignature/Sign';
import { GetCurrentCoordinates, GetLocalStorageItems } from '../../Services';
import axios from 'axios';

function TourList() {
  const invoicesData = useSelector(selectInvoicesItems); 
  const userLocationData = useSelector(selectuserLocationItems);
  const [groupedItemsInBasket, setGroupedItemsInBasket] = useState([]);
  const [showSign, setShowSign] = useState(false);
  const [showCam, setShowCam] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mapLink, setMapLink] = useState('');
  const [myLongitude, setMyLongitude] = useState(null);
  const [myLatitude, setMyLatitude] = useState(null);
  const [activeItem, setactiveItem] = useState();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [cameraImageUri, setCameraImageUri] = useState(null);
  const [isDataReady, setIsDataReady] = useState(false);
  const [sign, setSign] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [devName, setDevName] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate  = useNavigate();

  const flatInvoiceData = invoicesData.flat();
  const formatedData = flatInvoiceData.map((item, index) => ({
    address: `${item.strasse}, ${item.plz} ${item.ort}`,
    id: index + 1,
    image: 'https://transfer.klein-autoteile.at/aussendienst/safwan/naviAssets/images/noimg.png',
    key: index + 1,
    lat: parseFloat(item.lat),
    location: [parseFloat(item.lon), parseFloat(item.lat)],
    lon: parseFloat(item.lon),
    ls: item.bearbeitung_lfdnr,
    price: parseFloat(item.brutto),
    title: item.name1,
    devName: item.devName,
    arrival: item.arrival,
  }));
  
  useEffect(() => {
    const disableBackButton = () => {
      navigate(1); // التحرك إلى الأمام في سجل التصفح
    };
  
    window.history.pushState({}, ''); // قم بإضافة هذا السطر لضمان تحديث السجل
  
    window.addEventListener('popstate', disableBackButton);
  
    return () => {
      window.removeEventListener('popstate', disableBackButton);
    };
  }, [navigate]);


  useEffect(() => {
    const groupedItems = formatedData.reduce((results, item) => {
        const existingItem = results.find((result) => result.title === item.title);
        if (existingItem) {
            existingItem.id.push(item.id);
            existingItem.key.push(item.key);
            existingItem.ls.push(item.ls);
            existingItem.price.push(item.price);
        } else {
            results.push({
            address: item.address,
            devName: item.devName,
            id: [item.id],
            image: item.image,
            key: [item.key],
            lat: item.lat,
            location: item.location,
            lon: item.lon,
            ls: [item.ls],
            price: [item.price],
            title: item.title,
            arrival: item.arrival,
            });
        }
        return results;
    }, []);
    // بعد الانتهاء من عملية التجميع، قم بإضافة العنصر "itemIndex" لكل عنصر في "groupedItems"
    const groupedItemsWithIndex = groupedItems.map((item, index) => {
        return { ...item, itemIndex: index+1 };
    });
    setGroupedItemsInBasket(groupedItemsWithIndex.reverse());
  }, []);

  useEffect(() => {
    if (groupedItemsInBasket !== null || groupedItemsInBasket !== '') {
        const reshapedItemsForLink = reshapeItemsForLink(groupedItemsInBasket);
        console.log( "reshapedItemsForLink::: ", reshapedItemsForLink)
        const linkMap = 
        `https://transfer.klein-autoteile.at/aussendienst/safwan/safimaps/v3/?searchtools=false&query=${encodeURIComponent(JSON.stringify(reshapedItemsForLink))}&zoom=6&mode=map&userLocation=${encodeURIComponent(JSON.stringify({lat: userLocationData[0].lat, lon: userLocationData[0].long}))}`|| 
        `https://transfer.klein-autoteile.at/aussendienst/safwan/safimaps/v3/?searchtools=false&query=${encodeURIComponent(JSON.stringify(reshapedItemsForLink))}&zoom=6&mode=sat&userLocation=${encodeURIComponent(JSON.stringify({lat: userLocationData[0].lat, lon: userLocationData[0].long}))}`|| 
        `https://transfer.klein-autoteile.at/aussendienst/safwan/safimaps/v3/?searchtools=false&query=${encodeURIComponent(JSON.stringify(reshapedItemsForLink))}&zoom=6&mode=hot&userLocation=${encodeURIComponent(JSON.stringify({lat: userLocationData[0].lat, lon: userLocationData[0].long}))}`|| 
        `https://transfer.klein-autoteile.at/aussendienst/safwan/safimaps/v3/?searchtools=false&query=${encodeURIComponent(JSON.stringify(reshapedItemsForLink))}&zoom=6&mode=x&userLocation=${encodeURIComponent(JSON.stringify({lat: userLocationData[0].lat, lon: userLocationData[0].long}))}`;
        
        console.log("linkMap::: ", typeof(linkMap), linkMap);

        setMapLink(linkMap)
    }
  }, [groupedItemsInBasket]);

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
  
    /* Get the device_id + device coordinates */
    useEffect(() => {
      GetCurrentCoordinates().then(({ latitude, longitude }) => {
        const deviceName = GetLocalStorageItems('device_name');
        setLongitude(longitude);
        setLatitude(latitude);
        setDevName(deviceName);

      }).catch(error => {
          console.error('Error getting current coordinates:', error.message);
      });
    }, []);

  const reshapeItemsForLink = (items) => {
    return items.map(item => {
        const [housenumber, street] = item.address.split(' ', 2);
        const [, postalcode, state] = item.address.match(/(\d+) (\w+)/);
    
        return {
            street: street,
            state: state,
            country: "austria",
            postalcode: postalcode,
            housenumber: housenumber,
            display_name: item.title,
        };
    });
  }
  const handleCardChange  = (index) => {
    setActiveCardIndex(index+1);
    console.log("Active Card Index Updated:", index);
  };

  const onGoClick = async (item) => {
    console.log	("item::: ", typeof(item), item);
    setactiveItem (item);
    await fetchDataOnClick(); // انتظر حتى يتم جلب البيانات
    let roundLat = parseFloat(item.lat);
    let roundLon = parseFloat(item.lon);
    if (isNaN(roundLat) || isNaN(roundLon)) {
      console.error("Invalid latitude or longitude");
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
    console.log("mapLink::: ", mapLink);
    window.open(mapLink, "_blank");
    setShowModal(true);
  };

  const fetchDataOnClick = async () => {
    try {
      const locationPermission = await navigator.permissions.query({ name: 'geolocation' });

      if (locationPermission.state === 'granted' || locationPermission.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log("longitude::: ", longitude);
            console.log("latitude::: ", latitude);
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
    setactiveItem(item); // تعيين العنصر النشط
    setActiveCardIndex(index + 1); // تحديث البطاقة التالية كبطاقة نشطة

    console.log("showModal::: ", showModal);
  };
  const onClose = () => {
    setShowSign(false);
    setShowModal(false);
    setShowCam(false);
  };
  /* زر التوقيع يفتح شاشة التوقيع */
  const handleSign = (selected) => {
    setShowSign(true);
    setShowModal(false);
    setShowCam(false);
    console.log ("selected::: ", selected);
  };
  /* زر الكاميرا يفتح شاشة الكاميرا */
  const handleCam = () => {
    setShowCam(true);
    setShowSign(false);
    setShowModal(false);
    console.log ("showCam::: ", showCam);
  };

  const handleSelectedOptionChange = (option) => {
    setSelectedOption(option);
  };
  const onTakePhoto = (dataUri) => {
    setCameraImageUri(dataUri);
  };
  const onAcceptPhoto = () => {
    console.log ("cameraImageUri::: ", cameraImageUri);
    setIsDataReady(true);
    setShowCam(false);
  };

  const onSignature = (signature, name) => {
    console.log("signature::: ", signature);
    console.log("name::: ", name);
    const jsonName=JSON.stringify(name);
    setSign(signature);
    setCustomerName(jsonName.replace(/"/g, ''));
    setIsDataReady(true);
    setShowSign(false);
  };

  const saveSignature=()=>{
    console.log("sign::: ", sign);
    console.log("cameraImageUri::: ", cameraImageUri);
    console.log("item.ls::: ", typeof(activeItem.ls), activeItem.ls);
    console.log("devName::: ", typeof(activeItem.devName), activeItem.devName);
    if (typeof activeItem.ls === 'object' && Array.isArray(activeItem.ls)) {
      activeItem.ls.forEach(lsElement => {
            let dataArray=
                {
                    "ls": lsElement,
                    "lieferart": selectedOption,
                    "signatur": sign,
                    "lat": latitude,
                    "lon": longitude,
                    "devicename": devName,
                    "signatur_name": customerName,
                    "foto": cameraImageUri
                }
            ;
    
            console.log("dataArray::: ", typeof(dataArray), dataArray);
            saveToDb(dataArray);
        });
        alert("Saved");
    } else {
        console.error('item.ls is not an array:', activeItem.ls);
    }
  }


  const saveToDb=(data)=>{
    let headersList = {
        "Content-Type": "application/json" ,
    }
        
    let reqOptions = {
        url: "https://transfer.klein-autoteile.at/aussendienst/safwan/naviAssets/web_services/insert.php?action=navi_ablieferung",
        method: "POST",
        headers: headersList,
        data: data,
    }
    
    axios.request(reqOptions)
        .then((response) => {
            console.log("response::: ", response.data);
            onClose();
        })
        .catch((error) => {
            console.log(error);
        });
  }
  return (
    <div className="app-container ">
      <div className="sa-bg-main-dark-transparent rounded-lg mt-5 mb-5 ml-1 mr-1 pb-24">
      {groupedItemsInBasket.map((item, index) => (
          <CardList
            key={index}
            id={index}
            name={item.title}
            address={item.address}
            imageUrl={item.image}
            img={!item.screenImg ? '' : item.screenImg}
            lat={item.lat}
            lon={item.lon}
            ls={item.ls}
            price={item.price}
            devId={item.devName}
            arrival={item.arrival}
            item={item}
            onGoClick={() => onGoClick(item, index)}
            onOptionsClick={() => onOptionsClick(item, index)}
            isActive={index === activeCardIndex}
            onChange={() => handleCardChange(index)}
          />
          ))}
          </div>
  
      {/* مكون CustomerOptions خارج المكون Card */}
      {showModal && !showSign && !showCam &&
        <CustomerOptions 
          onSign={handleSign}
          onCam={handleCam}
          customerItem={activeItem}
          exitSign={() => onClose()}
          handleSelectedOptionChange={handleSelectedOptionChange}
        />
      }
      
      {/* مكون Sign خارج المكون Card */}
      {showSign && !showModal && !showCam &&
        <Sign 
          exitSign={() => onClose()} 
          onSignature={onSignature}
        />
      }
      {showCam && !showModal && !showSign &&
        <Camera 
          className="mx-auto" 
          onTakePhoto={onTakePhoto} 
          onAcceptPhoto={onAcceptPhoto} 
          exitCam={() => onClose()}
        />
      }
    </div>
  );
  
}

export default TourList;