import { useSelector } from 'react-redux';
import { selectuserLocationItems } from '../../Redux/userLocationSlice';
import './Final.css';
import { useEffect, useState } from 'react';
import { ButtonPrimary } from '../../Components';
import * as FaIcons from 'react-icons/fa6';
import klLogo from '../../assets/klLogo.png';
import icon from '../../assets/icon.png';

const Final = () => {
    const startPoint = useSelector(selectuserLocationItems);
    const [myLongitude, setMyLongitude] = useState(null);
    const [myLatitude, setMyLatitude] = useState(null);
    const [fullscreenEntered, setFullscreenEntered] = useState(false);
    const [customAlert, setCustomAlert] = useState({ show: false, message: "", onConfirm: null, type: "default" });

    useEffect(() => {
        console.log('startPoint From ExitScreen::: ', typeof (startPoint), startPoint);
    }, [startPoint]);

    // مستمع للتحقق من وضع ملء الشاشة كل 10 ثوان
    useEffect(() => {
        const checkFullscreen = () => {
        if (!document.fullscreenElement && !customAlert.show) {
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
                });
                } catch (error) {
                console.error('Failed to enter fullscreen mode:', error);
                }
            },
            type: "fullscreen"
            });
        }
        };

        // تشغيل الفحص الأولي
        checkFullscreen();

        // تشغيل الفحص كل 10 ثوان
        const intervalId = setInterval(checkFullscreen, 5000);

        return () => clearInterval(intervalId);
    }, [customAlert.show]);

    const onGoClick = async () => {
        await fetchDataOnClick();
        let roundLat = parseFloat(startPoint[0].lat);
        let roundLon = parseFloat(startPoint[0].long);
        console.log("roundLat::: ", roundLat);
        console.log("roundLon::: ", roundLon);

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

    /* const handleExit = () => {
        const storedOriginalPath = localStorage.getItem('originalPath');
        console.log('storedOriginalPath :::', storedOriginalPath);

    
        if (storedOriginalPath) {
          //navigate(storedOriginalPath);
          window.location.replace(storedOriginalPath); // استخدم window.location.replace بدلاً من navigate
        } else {
          // إذا لم يتم العثور على العنوان المخزن، قم بتوجيه المستخدم إلى "/login" كما هو معمول به حاليا
          //navigate("/login");
          window.location.replace("/"); // استخدم window.location.replace بدلاً من navigate

        }
    }; */

    const handleExit = () => {
    // --- تعديل: إضافة سطر لمسح بيانات الجولة المخزنة في الجلسة ---
    // هذا يضمن أن أي جولة تبدأ بعد الخروج ستكون نظيفة تمامًا
    sessionStorage.removeItem('completedTourLsNumbers');

    // الكود الأصلي الخاص بك يبقى كما هو
    window.close(); // ملاحظة: هذا السطر قد لا يعمل في كل المتصفحات لأسباب أمنية

    const storedOriginalPath = localStorage.getItem('originalPath');
    console.log('storedOriginalPath :::', storedOriginalPath);

    if (storedOriginalPath) {
    window.location.replace(storedOriginalPath);
    } else {
    window.location.replace("/");
    }
};

    // مكون النافذة المنبثقة المخصصة
    const CustomAlert = ({ message, onConfirm, type }) => (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="sa-bg-transparent rounded-lg p-4 text-white shadow-lg">
            <h2 className="text-2xl font-bold text-center text-white pb-4">Achtung!</h2>
            <p className="text-white">{message}</p>
            <div className="flex justify-end mt-4 gap-2">
            <button
                className="sa-bg-main-secondary text-white px-4 py-2 rounded"
                onClick={onConfirm}
            >
                OK
            </button>
            </div>
        </div>
        </div>
    );

    return (
        <div className="items-center justify-center  bg-white">
            <div className="sa-bg-main-dark-transparent h-screen flex flex-col items-center">
                <a
                    className="text-white"
                    href="https://safwan-nj.github.io"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                    className="w-16 border-none my-4 sa-bg-shadow-white-glow rounded-full"
                    src={icon}
                    alt="Logo"
                    />
                </a>

                <div className="flex flex-col items-center justify-center sa-bg-main-dark-transparent rounded-xl mx-4 px-4">
                    <h1 className="text-lg text-center p-3 rounded-xl mt-5 mb-4 sa-text-main-dark font-roboto font-bold">Alle Jobs wurden abgeschlossen</h1>
                    <h2 className="text-sm text-center mt-0 mb-4 sa-text-main-dark font-roboto font-medium">Sie können jetzt nach Hause fahren</h2>
                    <h3 className="text-md text-center mt-0 mb-4 sa-text-main-dark font-roboto font-semibold">👍 Vielen Dank für Ihre Arbeit</h3>
                    <h5 className="text-md text-center mt-0 mb-4 sa-text-main-dark font-roboto">Bis morgen</h5>

                    <ButtonPrimary
                    className="ml-2 mb-4"
                    title="Exit"
                    onPress={handleExit}
                    />
                    <p className="text-sm text-center mt-0 mb-4 sa-text-main-dark font-roboto font-medium">Möchten Sie die Karten öffnen, um nach Hause zurückzukehren?</p>
                    <button
                    className="btn m-4 sa-bg-main-dark-transparent text-md p-3 font-extrabold rounded-full cursor-pointer flex justify-center items-center"
                    onClick={onGoClick}
                    >
                    zurück zur Filiale fahren
                    </button>
                </div>

                <div className="fixed bottom-12 left-0 w-full flex items-center justify-center sa-bg-main-dark-transparent border-secondary-dark rounded-t-md p-2">
                    <img className="w-16 mr-3 mt-1" src={'https://www.klein-autoteile.at/content/uploads/2023/02/klein-logo-darkgrey.svg'} alt="Logo" />
                    <h6 className="text-sm sa-text-main-dark font-roboto font-medium mt-1">||    EDV Abteilung 2025 </h6>
                    <h6 className="text-xs sa-text-main-dark font-roboto font-medium mb-1"> © </h6>
                </div>

                {customAlert.show && (
                    <CustomAlert message={customAlert.message} onConfirm={customAlert.onConfirm} type={customAlert.type} />
                )}
            </div>
        </div>
    );
};

export default Final;