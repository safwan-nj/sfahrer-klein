import Slider from 'react-slick';
import './Tutorial.css';
import TutorialCard from './TutorialCard';
import { useEffect, useState } from 'react';

const Tutorial = () => {
  const [fullscreenEntered, setFullscreenEntered] = useState(false);
  const [customAlert, setCustomAlert] = useState({ show: false, message: "", onConfirm: null, type: "default" });

  // مستمع لدخول وضع ملء الشاشة عند النقر
  useEffect(() => {
    const enterFullscreen = () => {
      const element = document.documentElement;
      if (!document.fullscreenElement) {
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
  }, []); // إزالة الاعتماد على fullscreenEntered لضمان التحقق في كل مرة

  // مستمع للتحقق من وضع ملء الشاشة كل 5 ثوانٍ
  /* useEffect(() => {
    const checkFullscreen = () => {
      console.log('Checking fullscreen status:', document.fullscreenElement); // للتصحيح
      if (!document.fullscreenElement && !customAlert.show) {
        setCustomAlert({
          show: true,
          message: "Bitte wechseln Sie in den Vollbildmodus, um fortzufahren.",
          onConfirm: () => {
            const element = document.documentElement;
            element.requestFullscreen()
              .then(() => {
                setFullscreenEntered(true);
                setCustomAlert({ show: false, message: "", onConfirm: null, type: "default" });
              })
              .catch((error) => {
                console.error('Failed to enter fullscreen mode:', error);
                setCustomAlert({
                  show: true,
                  message: "Der Vollbildmodus konnte nicht aktiviert werden. Bitte versuchen Sie es erneut.",
                  onConfirm: null,
                  type: "error"
                });
              });
          },
          type: "fullscreen"
        });
      }
    };

    // التحقق الأولي عند تحميل المكون
    checkFullscreen();

    // التحقق كل 5 ثوانٍ
    const intervalId = setInterval(() => {
      checkFullscreen();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [customAlert.show]); // الاعتماد على customAlert.show فقط
 */

  const images = [
    'tut1', 'tut2', 'tut3', 'tut4', 'tut5', 'tut6',
    'tut71', 'tut72', 'tut73', 'tut74', 'tut75', 'tut76', 'tut8', 'tut9', 
    'retour1', 'retour2', 'retour3', 'retour4', 'retour5', 'retour6', 'retour7',
    'support1', 'support2', 'support3',
    'wichtig', 'tut10'
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: () => (
      <button className="ml-1 w-3 h-3 bg-gray-400 rounded-full hover:bg-gray-300 focus:bg-gray-300 transition-colors duration-200" />
    ),
  };

  // مكون النافذة المنبثقة المخصصة
  const CustomAlert = ({ message, onConfirm, type }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="sa-bg-transparent rounded-lg p-4 text-white">
        <h2 className="text-2xl font-bold text-center pb-4">Achtung!</h2>
        <p className="text-center">{message}</p>
        <div className="flex justify-end mt-4 gap-2">
          {onConfirm && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={onConfirm}
            >
              OK
            </button>
          )}
          {type === "error" && (
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={() => setCustomAlert({ show: false, message: "", onConfirm: null, type: "default" })}
            >
              Schließen
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="sa-bg-main-light h-[95vh]">
      <div className="flex flex-col items-center justify-center sa-bg-main-dark-transparent m-3">
        <div className="tut-slider-container">
          <Slider {...settings}>
            {images.map((image, index) => (
              <TutorialCard key={index} imagePath={image} />
            ))}
          </Slider>
        </div>
      </div>
      {customAlert.show && (
        <CustomAlert message={customAlert.message} onConfirm={customAlert.onConfirm} type={customAlert.type} />
      )}
    </div>
  );
};

export default Tutorial;