import { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './Navbar.css';
import { IconContext } from 'react-icons';
import klLogo from '../../assets/klLogo1.png'
import packageJson from '../../../package.json'; // استيراد package.json

function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);


  const toggleFullscreen = () => {
    const doc = window.document;
    const docEl = doc.documentElement;
  
    const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
  
    if (!isFullscreen) {
      requestFullScreen.call(docEl);
      setIsFullscreen(true);
    } else {
      cancelFullScreen.call(doc);
      setIsFullscreen(false);
    }
  };

  const refreshPage = () => {
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    window.location.reload(true);
    alert ("Die App ist neu gestartet");
  };
  
console.log("NavbarVersion:::", packageJson.version); // طباعة رقم الإصدار في وحدة التحكم
  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar'>
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          {/* <img className="w-24" src={klLogo} alt="Logo" /> */}
          <img 
            className="w-24" 
            src={klLogo} 
            alt="Logo" 
            //onDoubleClick={refreshPage} 
          />
          <div className='fullscreen-button' onClick={toggleFullscreen}>
            {isFullscreen ? <AiIcons.AiOutlineFullscreenExit /> : <AiIcons.AiOutlineFullscreen />}
          </div>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars bg-pink-700 p-2 rounded-full'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
            <li> 
              <p className='sa-text-main-secondary-light m-10 p-6 text-xs font-bold drop-shadow-lg'>
                Version: {packageJson.version} {/* استخدم رقم الإصدار هنا */}
              </p> 
            </li>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;