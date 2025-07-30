import * as FaIcons from 'react-icons/fa6';
import PropTypes from 'prop-types';
import moment from 'moment';
import './CustomerRow.css'
import { useEffect, useState } from "react";
//import { SparklesIcon as SparklesIconOutline } from "react-native-heroicons/outline";
//import { MinusCircleIcon } from "react-native-heroicons/outline";

const CustomerRow = ({id, name, name2, description, price, customerImg, customerAddress, removeItemFromInvoiceData, items}) => {
    //const [currentDate, setCurrentDate] = useState('');
    const [isPressed,setIsPressed] = useState(false);

    const icoImg ="https://transfer.klein-autoteile.at/aussendienst/safwan/naviAssets/images/noimg.png"


    /* useEffect(() => {
        //console.log("id from CustomerRow::: ", id)
        // الحصول على التوقيت الحالي
        const currentTime = moment();
        // التحقق مما إذا كان التوقيت الحالي يتوافق مع التوقيت الصيفي أم الشتوي
        const isDaylightSavingTime = currentTime.isDST();
        // تعيين UTC offset بناءً على التوقيت الحالي
        const utcOffset = isDaylightSavingTime ? '+02:00' : '+01:00';
        // استخدام UTC offset في تحديد منطقة الزمنية
        const scandate = currentTime.utcOffset(utcOffset).format(' hh:mm a');
        setCurrentDate(scandate);
        console.log(typeof(price*1));
        console.log(items);
    }, []); */



    return (
        <div className="customer-row ">

            <div 
                onClick={()=>setIsPressed(!isPressed)}
                className={`flex-col bg-white w-full shadow-lg p-2 rounded-xl ${
                    isPressed && "border-b-0 mb-3 "
                }`}
            >
                <div className="flex flex-row justify-between mx-2">
                    <div className="flex flex-col justify-between">
                        <p className="text-md mb-1 flex-shrink-0 sa-text-main-secondary font-semibold">{name || "Name"}</p>
                        
                            {price &&
                                <div className="flex-row ">
                                    <p className="text-gray-600 text-xs w-3/4 mb-2 flex-shrink-0">{name2}
                                    </p>
                                </div>
                            }
                            
                            <div className="flex-1 flex-row items-center">
                                <p className="sa-text-main-secondary-light font-semibold text-xs">Invoice.Nr:</p>
                                <p className="text-xs flex-shrink-0  sa-text-main-dark">{description || "description description description"}</p>
                            </div>
                            <div className="flex-1 flex-row items-center">
                                <p className="sa-text-main-secondary-light font-semibold text-xs">Invoice.Id:</p>
                                <p className="text-xs flex-shrink-0  sa-text-main-dark">{id||"id"}</p>
                            </div>
                            <div className="flex-1 flex-row items-center">
                                <p className="sa-text-main-secondary-light font-semibold text-xs">Adress:</p>
                                <p className="text-xs flex-shrink-0  sa-text-main-dark">{customerAddress||"customerAddre customerAddre customerAddre"}</p>
                            </div>
                        
                    </div>

                    <div className="flex flex-col items-center justify-between">
                        <p 
                            className="text-xs  sa-text-main-secondary font-bold "
                        >{
                            //items.duration ? items.duration : 
                            items.currentTime}</p>
                        {/* <img 
                            src={icoImg || customerImg}
                            className="h-16 rounded-xl flex-shrink-0 "
                            alt='customerImage'
                        /> */}
                    </div>
                </div>
            </div>
            {isPressed && (
    <div className="flex items-center justify-center">
        <div onClick={() => removeItemFromInvoiceData(items[0])} className='flex align-center'>
            {
                <div className="flex flex-col items-center justify-center bg-white shadow-lg p-2 rounded-xl ml-2">
                <FaIcons.FaRegTrashCan className="sa-text-main-secondary rounded-full w-8 h-8" />
                </div>
            }
        </div>
    </div>
)}

        </div>
    )
}
CustomerRow.propTypes = {
    //innerRef: PropTypes.string,
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    name2: PropTypes.string,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    customerImg: PropTypes.string.isRequired,
    customerAddress: PropTypes.string.isRequired,
    //lat: PropTypes.number,
    //lon: PropTypes.number,
    //duration: PropTypes.number,
    removeItemFromInvoiceData: PropTypes.func,
    items: PropTypes.array,

};
export default CustomerRow