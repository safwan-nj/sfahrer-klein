import './Tour.css'
import  { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectInvoicesItems } from '../../Redux/invoicesSlice';
import { selectuserLocationItems } from '../../Redux/userLocationSlice';

import Slider from 'react-slick';
//import { NavigationBarB } from '../../Components';
//import Card from '../../Components/Card/Card';
import { useNavigate } from 'react-router-dom';
import { ButtonPrimary, Camera, Card, CustomerOptions } from '../../Components';
import Sign from '../../Components/CustomerSignature/Sign';
import { GetCurrentCoordinates, GetLocalStorageItems } from '../../Services';
import axios from 'axios';

const Tour = () => {
  const invoicesData = useSelector(selectInvoicesItems); 
  const userLocationData = useSelector(selectuserLocationItems);
  const [groupedItemsInBasket, setGroupedItemsInBasket] = useState([]);
  const [showSign, setShowSign] = useState(false);
  const [showCam, setShowCam] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mapLink, setMapLink] = useState('');
  const [myLongitude, setMyLongitude] = useState(null);
  const [myLatitude, setMyLatitude] = useState(null);
  //const [isLocationReceived, setIsLocationReceived] = useState(false);
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
  
  //const [deviceName, setDeviceName] = useState();
  
  const navigate  = useNavigate();

  const flatInvoiceData = invoicesData.flat();
  //console.log("flatInvoiceData From Tour", flatInvoiceData);

  /* const startPoint = invoicesData[0].startPointOfTheTour;
  const endPoint = invoicesData[0].endPointOfTheTour; */

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
    land: item.land,
  }));
  
  useEffect(() => {
    // إضافة فحص لحالة invoicesData
    if (invoicesData.length === 0) {
      const confirmation = window.confirm("Die Seite wurde falsch navigiert, da keine Daten vorhanden sind. Klicken Sie auf OK, um zur Startseite zurückzukehren.");
      if (confirmation) {
        navigate('/'); // التوجه الى الصفحة الرئيسية
      }
    }

    const disableBackButton = () => {
      navigate(1); // التحرك إلى الأمام في سجل التصفح
    };

    window.history.pushState({}, ''); // قم بإضافة هذا السطر لضمان تحديث السجل

    window.addEventListener('popstate', disableBackButton);

    return () => {
      window.removeEventListener('popstate', disableBackButton);
    };
  }, [navigate, invoicesData]); // قم بإضافة invoicesData إلى قائمة الاعتماديات


  useEffect(() => {
    const groupedItems = formatedData.reduce((results, item) => {
        // البحث عن عنصر بنفس الإحداثيات lat و lon
        const existingItem = results.find((result) => result.lat === item.lat && result.lon === item.lon);
        
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
                land: item.land,
            });
        }
        return results;
    }, []);

    // إضافة الفهرس لكل عنصر بعد التجميع
    const groupedItemsWithIndex = groupedItems.map((item, index) => ({
        ...item, 
        itemIndex: index + 1
    }));

    setGroupedItemsInBasket(groupedItemsWithIndex.reverse());
    //setItemsLength(groupedItemsWithIndex.length);

  }, []);

  useEffect(() => {
    if (groupedItemsInBasket !== null || groupedItemsInBasket !== '') {
        const reshapedItemsForLink = reshapeItemsForLink(groupedItemsInBasket);
        //console.log( "reshapedItemsForLink::: ", reshapedItemsForLink)
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
        const deviceName = GetLocalStorageItems('device_id');
        setLongitude(longitude);
        setLatitude(latitude);
        //dispatch(clearAllInvoices());
        //dispatch(clearAlluserLocation());
        //dispatch(addTouserLocation({lat: latitude, long: longitude}));
        setDevName(deviceName);
        //console.log("DEVICE_ID:::::::", deviceName);
        //console.log("MYLAT:::::::", latitude);
        //console.log("MYLON:::::::", longitude);
      }).catch(error => {
          console.error('Error getting current coordinates:', error.message);
      });
    }, []);

  const reshapeItemsForLink = (items) => {
    console.log("items reshapedItemsForLink from Tour:::", items)
    return items.map(item => {
        const [housenumber, street] = item.address.split(' ', 2);
        const [, postalcode, state] = item.address.match(/(\d+) (\w+)/);
    
        return {
            street: street,
            state: state,
            country: item.land,
            postalcode: postalcode,
            housenumber: housenumber,
            display_name: item.title,
        };
    });
  }
  const handleCardChange  = (index) => {
    setActiveCardIndex(index+1);
    //setActiveCard(index);
    console.log("Active Card Index Updated:", index);
    /* if (index===groupedItemsInBasket.length - 1){
      console.log("Active Card FINAL");
      activBar(4);
    } */
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const onGoClick = async (item) => {
    console.log	("item::: ", typeof(item), item);
    setactiveItem (item);
    await fetchDataOnClick(); // انتظر حتى يتم جلب البيانات
    let roundLat = parseFloat(item.lat);
    let roundLon = parseFloat(item.lon);
    //console.log("roundLat::: ", item.lat);
    //console.log("roundLon::: ", item.lon);
    //console.log("item::: ", item);
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
    //setShowOptionsButton(false);
    //setShowModal(true);
    //activBarSign(); // استدعاء الدالة عند النقر على الزر "Go"
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
            //setIsLocationReceived(true);
            //dispatch(clearAllInvoices());
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
    //handleCardChange();
    //console.log("onOptionsClick::: ", item);
    //activBarSign();
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
    // Request fullscreen
  };
  /* زر الكاميرا يفتح شاشة الكاميرا */
  const handleCam = () => {
    setShowCam(true);
    setShowSign(false);
    setShowModal(false);
    console.log ("showCam::: ", showCam);
  };

  const handleSelectedOptionChange = (option) => {
    //console.log("option::: ", option);
    setSelectedOption(option);
  };
  const onTakePhoto = (dataUri) => {
    //console.log ("dataUri::: ", dataUri);
    setSign(''); // قم بتعيين قيمة التوقيع إلى قيمة فارغة عند التقاط الصورة
    setCameraImageUri(dataUri);
  };
  const onAcceptPhoto = () => {
    console.log ("cameraImageUri::: ", cameraImageUri);
    //setCameraImageUri(dataUri);
    setIsDataReady(true);
    setShowCam(false);
  };

  const onSignature = (signature, name) => {
    console.log("signature::: ", signature);
    console.log("name::: ", name);
    const jsonName=JSON.stringify(name);
    setSign(signature);
    setCameraImageUri(''); // قم بتعيين قيمة الصورة إلى قيمة فارغة عند التوقيع
    setCustomerName(jsonName.replace(/"/g, ''));
    setIsDataReady(true);
    setShowSign(false);
  };

  const saveSignature = async ()=>{
    await fetchDataOnClick(); // انتظر حتى يتم جلب البيانات

    console.log("sign::: ", sign);
    console.log("cameraImageUri::: ", cameraImageUri);
    console.log("item.ls::: ", typeof(activeItem.ls), activeItem.ls);
    console.log("devName::: ", typeof(activeItem.devName), activeItem.devName);

    if (sign === "" && cameraImageUri === "") {
      alert("Bitte ergänzen Sie die fehlenden Angaben (Unterschrift oder Foto");
      return; // إيقاف العملية إذا كانت البيانات غير كاملة
    }
    const randomOffset = () => (Math.random() * 0.00001 - 0.000005); // قيمة بين -0.0000005 و +0.0000005
    
    
    if (typeof activeItem.ls === 'object' && Array.isArray(activeItem.ls)) {
      activeItem.ls.forEach(lsElement => {
            //const formattedLs = lsElement.replace(/\./g, '').slice(0, -8);
            //console.log("lsElement::: ", typeof(lsElement), lsElement);
    
            let dataArray=
                {
                    "ls": lsElement,
                    "lieferart": selectedOption,
                    "signatur": sign,
                    "lat": activeItem?.lat ? (parseFloat(activeItem.lat) + randomOffset()).toFixed(7) : latitude, 
                    "lon": activeItem?.lon ? (parseFloat(activeItem.lon) + randomOffset()).toFixed(7) : longitude,
                    "devicename": devName,
                    "signatur_name": customerName,
                    "foto": cameraImageUri
                }
            ;
    
            console.log("dataArray::: ", typeof(dataArray), dataArray);
            saveToDb(dataArray);
        });
        alert("Saved");
        //handleCloseSignModal();
    } else {
        console.error('item.ls is not an array:', activeItem.ls);
    }
  }


  const saveToDb=(data)=>{
    let headersList = {
        "Content-Type": "application/json" ,
        //"Access-Control-Allow-Origin": "http://localhost:3000",
    }
        
    let reqOptions = {
        url: "https://transfer.klein-autoteile.at/aussendienst/safwan/naviAssets/web_services/insert.php?action=navi_ablieferung",
        //url: "http://localhost/apps/insert.php?action=navi_ablieferung",
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

        /* AxiosConnect('POST', "navi_ablieferung", data)
        .then((response) => {
            console.log("response::: ", response);
            onClose();
        }) */
  }
  return (
    <div className="app-container">
      <iframe 
        className="map" 
        title="map" 
        src={mapLink} 
      />
      <div className="flex-1 mt-2 bg-[#141933]">
        <div className="slider-container">
          <Slider {...settings}>
            {groupedItemsInBasket.map((item, index) => (
              <Card
                key={item.itemIndex}
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
                onOptionsClick={() => onOptionsClick(item,index)}
                //activBarMap={()=>activBar(2)}
                isActive={index === activeCardIndex}
                onChange={() => handleCardChange(index)}
              />
            ))}
            <h5 className="text-red-400 m-2">Bitte klicken Sie auf die Nächste Schaltfläche NUR wenn Sie fertig sind. Sobald Sie auf die Schaltfläche klicken, werden alle Daten gelöscht. </h5>
            <ButtonPrimary
              title="🏠 Zurück zur Filiale 🏠"
              onPress={() => {
                const confirmation = window.confirm("Alle Daten werden gelöscht, sobald Sie auf die Schaltfläche klicken. Sind Sie sicher, dass Sie fortfahren möchten?");
                if (confirmation) {
                  navigate('/final');
                }
              }}
              specClass='sa-bg-done-transparent w-[94%] rounded-full py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            />
          </Slider>
        </div>
      </div>

      {/* مكون CustomerOptions خارج المكون Card */}
      {showModal && !showSign && !showCam &&
        <CustomerOptions 
          //optArray={item} 
          onSign={handleSign}
          onCam={handleCam}
          customerItem= {activeItem}
          exitSign={()=>onClose()}
          handleSelectedOptionChange={handleSelectedOptionChange}
        />
      }
      
      {/* مكون Sign خارج المكون Card */}
      {showSign && !showModal && !showCam &&
        <Sign 
          exitSign={()=>onClose()} 
          onSignature={onSignature}
        />
      }
      {showCam && !showModal && !showSign &&
        <Camera 
          className="mx-auto" 
          onTakePhoto={onTakePhoto} 
          onAcceptPhoto={onAcceptPhoto} 
          exitCam={()=>onClose()}
        />
      }
    </div>
  );
};

export default Tour;