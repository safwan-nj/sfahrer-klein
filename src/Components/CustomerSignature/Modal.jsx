import { useState, useEffect, useRef } from 'react';
import AxiosConnect from '../../Services/AxiosConnect';
import CustomerSignature from './CustomerSignature';
import './Modal.css';
import CameraComponent from './CameraComponent ';
import { FaPencil , FaX } from "react-icons/fa6";
import axios from 'axios';

const Modal = ({ item, onClose, lieferScheine }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [signOptions, setSignOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showSignature, setShowSignature] = useState(false);
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [devName, setDevName] = useState("");
    const [sign, setSign] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [cameraImageUri, setCameraImageUri] = useState(null);
    const modalRef = useRef(null);
    const [isDataReady, setIsDataReady] = useState(false);

    useEffect(() => {
        // نضيف المكون إلى DOM عند تشغيل التأثير
        if (showOptions) {
        document.body.appendChild(modalRef.current);
        }
    }, [showOptions]);

    useEffect(() => {
        AxiosConnect('POST', "navi_lieferart")
        .then((response) => {
            console.log('responseLieferArt::: \n', JSON.stringify(response));
            if (response && Array.isArray(response.value)) {
                const sortedOptions = response.value.sort((a, b) => parseInt(a.sort) - parseInt(b.sort));
                setSignOptions(sortedOptions);
                console.log('responseLieferArt::: \n', JSON.stringify(response));
            } else {
                console.error('Response does not contain an array:', response);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

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
            //setIsLocationReceived(true);
            //dispatch(clearAllInvoices());
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

    /* Get the device_id from LocalStorage */
    const getLocalStorageItems = () => {
        const localItems = localStorage.getItem('device_id');
        if (localItems) {
        return localItems; // قم بإرجاع القيمة مباشرة بدون تحويلها إلى سلسلة JSON
        } else {
        return "The device_id are empty";
        }
    }

    const onSignClick = () => {
        setShowSignature(true);
    };

    const onCloseModal = () => {
        onClose();
        setShowOptions(false);
    };
    const onCloseSignature = () => {
        setShowSignature(false)
    };

    const onTakePhoto = (dataUri) => {
        setCameraImageUri(dataUri);
    };
    
    const onSignature = (signature, name) => {
        const jsonName=JSON.stringify(name);
        setSign(signature);
        setCustomerName(jsonName.replace(/"/g, ''));
        setIsDataReady(true);
        if (sign && cameraImageUri && customerName && selectedOption) {
            setIsDataReady(true);
            //saveSignature();
        }else {
            console.log("click again");
            return
        }
    };
    const onDropDownSelect = (e) => {
        const optionSelected = e.target.value;
        setSelectedOption(optionSelected);
        console.log(optionSelected);
    };

    const saveSignature=()=>{
        console.log("sign::: ", sign);
        console.log("cameraImageUri::: ", cameraImageUri);
        console.log("item.ls::: ", typeof(item.ls), item.ls);
        console.log("devName::: ", typeof(devName), devName);
        if (typeof item.ls === 'object' && Array.isArray(item.ls)) {
            item.ls.forEach(lsElement => {
                //const formattedLs = lsElement.replace(/\./g, '').slice(0, -8);
                console.log("lsElement::: ", typeof(lsElement), lsElement);
        
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
            //handleCloseSignModal();
        } else {
            console.error('item.ls is not an array:', item.ls);
        }
    }



    
    const saveToDb=(data)=>{
        let headersList = {
            "Content-Type": "application/json" ,
            //"Access-Control-Allow-Origin": "http://localhost:3000",
        }
            
        let reqOptions = {
            url: "https://transfer.klein-autoteile.at/aussendienst/safwan/naviAssets/web_services/insert.php?action=navi_ablieferung",
            //url: "http://192.168.10.37/apps/insert.php?action=navi_ablieferung",
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
        <div className={`modal sa-bg-transparent border-blue-500 rounded-xl p-5 m-5 h-full`} ref={modalRef}>
        {showSignature ? (
            <CustomerSignature onClose={() => onCloseSignature()} onSignature={onSignature} />
        ) : (
            <div className="modal-body rounded-xl shadow-xl">
                <div className="lss">
                    {lieferScheine.map((item, index) => 
                        <span 
                            className="text-sm sa-text-main-dark-transparent rounded-md p-1 m-1 shadow-xl" 
                            key={index}
                        > {item}
                        </span>
                    )}
                </div>
                <button
                    className="modal-close sa-bg-transparent rounded-full text-xl text-white p-2 m-3"
                    onClick={onCloseModal}
                >
                    <FaX />
                </button>
                <ul className="options-list">
                    <li>
                    <select
                        className="form-control w-full rounded-lg p-3 sa-bg-main-light-transparent text-white"
                        name="option2"
                        value={selectedOption || ''}
                        onChange={onDropDownSelect}
                    >
                        <option value="" disabled>Please Select ...</option>
                        {signOptions.map((option) => (
                            <option
                                key={option.key}
                                value={option.key}  
                                className="sa-bg-transparent text-blue-800 font-semibold text-center"
                            >
                                {option.value}
                            </option>
                        ))}
                    </select>
                    </li>
                    <li>
                    </li>
                    <li>
                        <div className="flex space-between items-center py-3 my-9">
                            <CameraComponent onTakePhoto={onTakePhoto} className="mx-auto" />
                            <button
                                className="flex-row btn mx-auto text-white text-3xl shadow-lg my-3 sa-bg-transparent rounded-full p-3"
                                onClick={onSignClick}
                            >
                                <FaPencil  />
                            </button>
                        </div>
                    </li>
                </ul>
                
            </div>
        )}
        </div>
    );
};

export default Modal;
