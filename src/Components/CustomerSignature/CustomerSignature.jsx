import { useEffect, useState } from 'react'
import ReactSignatureCanvas from 'react-signature-canvas'
import { FaFloppyDisk , FaTrashCan , FaX} from "react-icons/fa6";

import './CustomerSignature.css'



const CustomerSignature = ({onClose, onSignature }) => {
    const [signatureRef, setSignatureRef] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [isSignatureSaved, setIsSignatureSaved] = useState(false);
    const [fullscreenEntered, setFullscreenEntered] = useState(false);


    const clearSignature = () => {
        signatureRef.clear();
    };

    const saveSignature = () => {
        const dataUrl = signatureRef.toDataURL();
        console.log("customerName in saveSignature::: ", typeof(customerName), customerName);
        console.log("customerName in saveSignature::: ", typeof(customerName), customerName);

        //alert(dataUrl);
        onSignature(dataUrl, customerName || '');
        setIsSignatureSaved(true);
    };
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
        if (isSignatureSaved) {
            setIsSignatureSaved(false);
        }
    }, [isSignatureSaved]);

    return (
        <div className="customer-signature full-screen">
            {/* زر اغلاق التوقيع */}
            <button  
                className="modal-close sa-bg-transparent rounded-full text-xl text-white p-2 m-1"
                onClick={onClose}
                >
                <FaX />
            </button>
            {/* زر مسح التوقيع */}
            <button
                className="onTop sa-bg-transparent text-xl text-white p-1 mr-3 rounded-full cursor-pointer"
                onClick={clearSignature}
                >
                <FaTrashCan />
            </button>
            {/* زر حفظ التوقيع */}
            <button
                className="onTop sa-bg-transparent text-xl text-white p-1 mr-3 rounded-full cursor-pointer"
                onClick={saveSignature}
                >
                <FaFloppyDisk />
            </button>
             {/* حقل إدخال للاسم */}
            <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="sa-bg-transparent text-white w-44 rounded-lg p-2"
            />
            {/* مساحة التوقيع */}
            <ReactSignatureCanvas
                ref={(ref) => setSignatureRef(ref)}
                canvasProps={{ className: 'signature-canvas' }}
            />
        </div>
    )
}

export default CustomerSignature