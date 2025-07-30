import * as FaIcons from "react-icons/fa6";
import React, { useEffect, useState, useRef } from "react";
import ReactSignatureCanvas from 'react-signature-canvas';
import './CustomerSignature.css';

const Sign = ({ exitSign, onSignature }) => {
    const [signatureRef, setSignatureRef] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [isSignatureSaved, setIsSignatureSaved] = useState(false);
    const [fullscreenEntered, setFullscreenEntered] = useState(false);
    const inputRef = useRef(null);

    /* useEffect(() => {
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
    }, [fullscreenEntered]); */

    useEffect(() => {
        if (isSignatureSaved) {
            setIsSignatureSaved(false);
        }
    }, [isSignatureSaved]);

    const clearSignature = () => {
        signatureRef.clear();
    };

    const saveSignature = () => {
        if (signatureRef.isEmpty()) {
            alert("Bitte unterschreiben Sie vor dem Speichern");
            return;
        }
        const dataUrl = signatureRef.toDataURL();
        onSignature(dataUrl, customerName || '');
        setIsSignatureSaved(true);
    };

    const handleHideKeyboard = () => {
        inputRef.current.blur();
    };

    const handleEnterKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleHideKeyboard();
        }
    };

    return (
        <div className="customer_signature rounded-lg rounded-b-lg sa-bg-main-dark-transparent">
            <div className="flex justify-between items-center align-center mb-3 sa-bg-main-dark-transparent">
                <button
                    className="modal-close sa-bg-main-dark-transparent rounded-full text-xl text-white p-2 m-1"
                    onClick={exitSign}
                >
                    <FaIcons.FaX />
                </button>
                <button
                    className="onTop bg-red-700 text-xl text-white p-2 mr-3 rounded-full cursor-pointer"
                    onClick={clearSignature}
                >
                    <FaIcons.FaTrashCan />
                </button>
                <button
                    className="onTop sa-bg-main-secondary text-xl text-white p-2 mr-3 rounded-full cursor-pointer"
                    onClick={saveSignature}
                >
                    <FaIcons.FaFloppyDisk />
                </button>
            </div>
            <div className="flex items-center justify-between sa-bg-main-dark-transparent">
                <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="rounded-md border p-2 m-2 w-full sa-bg-main-light sa-text-main-dark font-semibold"
                    ref={inputRef}
                    onKeyPress={handleEnterKeyPress} // استدعاء الدالة عند الضغط على مفتاح Enter
                />
                <button
                    className="sa-bg-main-secondary text-xl text-white p-2 rounded-full cursor-pointer mx-2"
                    onClick={handleHideKeyboard}
                >
                    <FaIcons.FaCheckDouble />
                </button>
            </div>
            <ReactSignatureCanvas
                ref={(ref) => setSignatureRef(ref)}
                canvasProps={{ className: 'signature-canvas mt-2' }}
            />
        </div>
    );
};

export default Sign;
