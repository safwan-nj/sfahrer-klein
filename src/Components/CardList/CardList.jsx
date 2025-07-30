import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './CardList.css';
import { useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa6';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const CardList = ({ id, item, onGoClick, onOptionsClick, isActive, countLength, isCompleted }) => {
  const [isGoClicked, setIsGoClicked] = useState(false);
  const [itemsCounter, setItemsCounter] = useState(countLength);
  const [showFinalButton, setShowFinalButton] = useState(false); 

  const navigate = useNavigate();

  const handleGoClick = () => {
    setIsGoClicked(true); 
    onGoClick(); 
  };

  const handleSignClick = () => {
    onOptionsClick(); 
  };
  
  const handleReturn = () => {
    const userConfirmed = window.confirm("Möchten Sie wirklich zu „Artikel zurückgeben“ gehen?");
    if (userConfirmed) {
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
      navigate('/retour');
    }
  };

  useEffect(() => {
    if (itemsCounter === 0) {
      setShowFinalButton(true);
    }
  }, [itemsCounter]);

  return (
    <div className="card-container">
      {/* --- التعديل: استبدال الأيقونة التي سببت المشكلة بكود SVG آمن --- */}
      {isCompleted && (
        <div className="completed-checkmark">
          {/* هذا كود SVG لرسم أيقونة check، وهو لا يعتمد على أي مكتبة خارجية */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      <div className={`card-body ${isCompleted ? 'card-body-completed' : ''}`}>
        <h5 className="card-title">{`${id + 1}- ${item.title}\u00A0\u00A0\u00A0\u00A0(${item.ls.length})`}</h5>
        <p className={`card-text ${isCompleted ? 'sa-text-main-light' : 'sa-text-main-dark'} `}>{item.address}</p>
        <div className="buttons">
          <button
            className={`btn text-black btn-go ${isGoClicked ? 'sa-bg-done-transparent' : 'sa-bg-main-dark-transparent'}`}
            onClick={handleGoClick}
          >
            <FaIcons.FaMapLocationDot />
          </button>
          <button
            className="btn btn-sign sa-bg-main-dark-transparent"
            onClick={handleSignClick}
          >
            <FaIcons.FaPencil />
          </button>
        </div>
      </div>
    </div>
  );
};

CardList.propTypes = {
  id: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  onGoClick: PropTypes.func.isRequired,
  onOptionsClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  countLength: PropTypes.number,
  isCompleted: PropTypes.bool,
};

CardList.defaultProps = {
    isCompleted: false,
};

export default CardList;