import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { ButtonPrimary, CustomerOptionsLine } from '../';
import './CustomerOptions.css';
import * as FaIcons from "react-icons/fa6";
import AxiosConnect from '../../Services/AxiosConnect';

const CustomerOptions = ({ customerItem, onCam, onSign, exitSign, handleSelectedOptionChange }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [signOptions, setSignOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showPencilButton, setShowPencilButton] = useState(false);
    const [fullscreenEntered, setFullscreenEntered] = useState(false);

    useEffect(() => {
        const enterFullscreen = () => {
            const element = document.documentElement;
            try {
                element.requestFullscreen();
                setFullscreenEntered(true);
                } catch (error) {
                console.error('Failed to enter fullscreen mode:', error);
                }
        };
    
        document.addEventListener('click', enterFullscreen);
    
        return () => {
            if (document.fullscreenElement === document.documentElement) {
                // التحقق من أن الشاشة الكاملة مرتبطة بالعنصر الجذر (document.documentElement)
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

    useEffect(() => {
        console.log("customerItem::: ", typeof(customerItem), customerItem);
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const deviceName = customerItem ? customerItem.devName : null;
        const lieferSchein = customerItem ? customerItem.ls : null;
        if (deviceName && lieferSchein) {
            console.log ('customerItem::: ', customerItem);
        }
        AxiosConnect('POST', "navi_lieferart")
            .then((response) => {
                if (Array.isArray(response)) {
                    const sortedOptions = response.sort((a, b) => parseInt(a.sort) - parseInt(b.sort));
                    setSignOptions(sortedOptions);
                    console.log('responseLieferArt:::', response);
                } else {
                    console.error('Response is not an array:', response);
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
    }, []);

    const onDropDownSelect = (e) => {
        const optionSelected = e.target.value;
        //console.log('optionSelected::: ', optionSelected);
        setSelectedOption(optionSelected);
        handleSelectedOptionChange(optionSelected); // استدعاء الدالة الممررة كمعلمة
        const selectedOptionText = signOptions.find(option => option.key === optionSelected)?.value; // الحصول على نص الخيار المحدد
        setShowPencilButton(
            selectedOptionText === 'Übergabe an Kunden' ||
            selectedOptionText === 'Ware an dritte Person übergeben' ||
            selectedOptionText === 'Kunde nicht anwesend - Ware wieder mitgenommen' ||
            selectedOptionText === 'Annahme durch Kunden abgelehnt'
        ); // تعيين قيمة الحالة لعرض زر القلم بناءً على النص المحدد
    };
    
    return (
        <div className="customer_options rounded-b-lg sa-bg-main-light-transparent flex flex-col ">
            <div className="flex justify-between items-center align-center sa-bg-main-secondary p-2">
                {/* زر اغلاق التوقيع */}
                <button  
                    className=" sa-bg-main-dark-transparent modal-close rounded-full text-xl text-white p-2 ml-1"
                    onClick={() => exitSign()}
                >
                    <FaIcons.FaX />
                </button>
                <p className="text-center text-white text-xs font-bold">{customerItem.title} </p>
                <p className="text-center text-white text-xs font-bold">
                    Gesamtsumme: {(Array.isArray(customerItem.price) ? customerItem.price.reduce((acc, curr) => acc + curr, 0) : customerItem.price).toFixed(2)} €
                </p>
            </div>

            <div className="sa-bg-main-dark-transparent">
                <div
                    className="bg-white rounded-lg p-2 shadow-md border flex flex-col gap-2 cursor-pointer mt-3 mx-3 "
                >
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-xs sa-text-main-secondary-light ">Aktuelle Uhrzeit</span>
                        <span className="text-xs text-gray-600 text-right">{currentTime.toLocaleTimeString('de-DE') + " Uhr"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-xs sa-text-main-secondary-light ">Standort</span>
                        <span className="text-xs text-gray-600 text-right">{customerItem.address}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-xs sa-text-main-secondary-light ">Lieferschein / e Nr:</span>
                        <span className="text-xs text-gray-600 text-right">{customerItem.ls.map(lsNumber => lsNumber).join(' & ')}</span>
                    </div>

                </div>

                <div className="dropdown-container flex-col justify-between items-center align-center sa-bg-main-dark my-4 ">
                    <select
                        className="form-control sa-bg-main-light w-[98vw] sa-text-main-dark p-3 border border-pink-500 rounded-md "
                        name="option2"
                        value={selectedOption || ''}
                        onChange={onDropDownSelect}
                        style={{backgroundColor: 'blue', color: 'white'}} // تغيير لون خلفية القائمة ولون النص
                    >
                        <option value="" disabled>Please Select ...</option>
                        {signOptions.map((option, index) => (
                            <option
                                key={index}
                                value={option.key}   
                            >
                                {option.value}
                            </option>
                        ))}
                    </select>
                </div>
            
                <div className="options-buttons flex-row ">
                    <div 
                        className=" rounded-xl sa-bg-main-light-transparent w-full"
                    >
                        {showPencilButton && ( // يتم عرض زر القلم إذا كانت الحالة مفعلة
                            <ButtonPrimary
                                className={`flex justify-center items-center text-xl`}
                                title={<FaIcons.FaPencil/>}
                                onPress={onSign}
                            />
                        )}
                        {!showPencilButton && selectedOption && ( // يتم عرض زر الكاميرا إذا كانت الحالة غير مفعلة وتم اختيار خيار
                            <ButtonPrimary
                                className={`flex justify-center items-center text-xl`}
                                title={<FaIcons.FaCamera/>}
                                onPress={onCam}
                            />
                        )}
                    </div>
                </div>
            </div>
            <hr className='my-2' />
        </div>
    );
};

CustomerOptions.propTypes = {
    customerItem: PropTypes.object,
    handleSelectedOptionChange: PropTypes.func
};

export default CustomerOptions;

