// Card.js
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Card.css';
import { useEffect, useState } from 'react';
//import Modal from './Modal';

const Card = ({ item, onGoClick, onOptionsClick, isActive, onChange }) => {
  const [fullscreenEntered, setFullscreenEntered] = useState(false);
  const [isGoClicked, setIsGoClicked] = useState(false); // إضافة حالة محلية للزر Go
  const [isSignClicked, setIsSignClicked] = useState(false); // إضافة حالة محلية للزر Sign


  const handleGoClick = () => {
    setIsGoClicked(true); // تحديث الحالة المحلية للزر Go عند النقر عليه
    onGoClick(); // استدعاء دالة onGoClick التي تمررها كـ prop
  };
  const handleSignClick = () => {
    setIsSignClicked(true); // تحديث الحالة المحلية للزر Go عند النقر عليه
    onOptionsClick(); // استدعاء دالة onGoClick التي تمررها كـ prop
  };

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
  }, [fullscreenEntered]); */
  /* useEffect(() => {
    if (isActive) {
      onChange();  // استدعاء onChange فقط إذا كانت البطاقة هي البطاقة الفعالة
    }
  }, [isActive]); */

  return (
    <div className={`card-container ${isSignClicked ? 'hidden' : ''}`}>
      <div className="card">
        <div className="card-top">
          <div className="name">{`${item.title}\u00A0\u00A0\u00A0\u00A0(${item.ls.length})`}</div>
        </div>
        <div className="card-body">
          <img src={item.image} alt="Customer Avatar" className="avatar" />
          <div className="address">{item.address}</div>
        </div>
        <div className="card-bottom">
          <div className="button-container">
              <button 
                className={`btn w-36 ${isGoClicked ? 'sa-bg-done-transparent' : 'sa-bg-transparent'} text-lg p-3 font-extrabold text-white rounded-lg m-1 cursor-pointer `}
                //disabled={isGoClicked} // تعطيل الزر Go بمجرد النقر عليه
                onClick={handleGoClick}
              >Go
              </button>
              <button 
                className={`btn w-36 ${isSignClicked ? 'sa-bg-done-transparent' : 'sa-bg-transparent'} text-lg p-3 font-extrabold text-white rounded-lg m-1 cursor-pointer`} 
                //disabled={isSignClicked} // تعطيل الزر Sign بمجرد النقر عليه
                onClick={handleSignClick}
              >Options
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
