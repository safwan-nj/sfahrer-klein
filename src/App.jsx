import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import {RootNavigator} from './Services';
import {Navbar} from './Components';
import { store } from './store';
import { useEffect, useState } from 'react';

const App = () => {

  const [fullscreenEntered, setFullscreenEntered] = useState(false);

  useEffect(() => {
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

  return (
    <>
      <Router>
        <Navbar/>
        <Provider store={store}>
        <RootNavigator />
      </Provider>
      </Router>
    </>
  );
};

export default App;
