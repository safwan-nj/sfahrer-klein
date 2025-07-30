import { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa6";
import './Camera.css';
import Compressor from 'compressorjs';

const Camera = ({ onTakePhoto, onAcceptPhoto,  exitCam }) => {
    const [capturedImage, setCapturedImage] = useState(null);
    const [fullscreenEntered, setFullscreenEntered] = useState(false);

    /* useEffect(() => {
        const enterFullscreen = () => {
            const element = document.documentElement;
            if (!fullscreenEntered) {
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
 */
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            new Compressor(file, {
                quality: 0.1, // تحديد جودة الصورة المضغوطة
                success(result) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        onTakePhoto(reader.result);
                        setCapturedImage(reader.result); // Set the captured image
                    };
                    reader.readAsDataURL(result);
                },
                error(err) {
                    console.error('Compression failed:', err);
                },
            });
        }
    };

    const resetCapture = () => {
        setCapturedImage(null); // Reset captured image
    };
    const acceptCapture = () => {
        onTakePhoto(capturedImage);
        onAcceptPhoto(); // Reset captured image
    };

    return (
        <div className="customer_options rounded-b-lg sa-bg-main-dark-transparent">
            <div className="flex justify-between items-center align-center sa-bg-main-dark-transparent p-2">
                {/* زر اغلاق التوقيع */}
                <button  
                    className="sa-bg-main-dark-transparent modal-close rounded-full text-xl text-white p-2 ml-1"
                    onClick={() => exitCam()}
                >
                    <FaIcons.FaX />
                </button>
            </div>
            <div className="lines-content sa-bg-main-light-transparent">
                {capturedImage && (
                    <div className="sa-bg-main-dark-transparent rounded-lg rounded-b-lg text-center">
                        <img 
                            className="max-w-full max-h-full rounded-lg rounded-b-lg inline-block"
                            style={{ width: '300px', height: 'auto' }} 
                            src={capturedImage} 
                            alt="Captured" 
                        />
                        <div className="flex justify-center items-center sa-bg-main-light-transparent w-full rounded-md">
                            <button 
                                className="sa-bg-main-dark  rounded-full text-xl text-white p-2 m-5"
                                onClick={resetCapture}
                            >
                                <FaIcons.FaArrowRotateLeft /> {/* إعادة التقاط الصورة */}
                            </button>
                            <button 
                                className="sa-bg-main-secondary rounded-full text-xl text-white p-2 m-5"
                                onClick={acceptCapture}
                            >
                                <FaIcons.FaCheck /> {/* تأكيد التوقيع */}
                            </button>
                        </div>
                    </div>
                )}
                {!capturedImage && (
                    <div className="dropdown-container flex-col justify-between items-center align-center sa-bg-main-light rounded-xl mt-3">
                        <div className="flex justify-center items-center sa-bg-main-dark-transparent w-20 h-20 m-4 rounded-md">
                            <input
                                type="file"
                                accept="image/*"
                                capture="camera"
                                id="fileInput"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <div  
                                className="sa-bg-main-secondary modal-close rounded-full text-xl text-white drop-shadow-2xl p-3 mt-10 mb-10"
                            >
                                <label 
                                    htmlFor="fileInput" 
                                    className="text-white text-3xl shadow-lg cursor-pointer rounded-full flex justify-center items-center "
                                >
                                    <FaIcons.FaCamera />
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
    
};

export default Camera;
