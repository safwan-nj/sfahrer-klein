import { Route, Routes } from 'react-router-dom';
import {Home, TourList, Tour, Final, Retour, Support, Tutorial,
    //KassaList,
    Kassa} from '../Pages';
import { useEffect, useState } from 'react';


const RootNavigator = () => {
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
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/tourlist' element={<TourList />} />
            {/* <Route path='/kassalist' element={<KassaList />} /> */}
            <Route path='/kassa' element={<Kassa />} />
            <Route path='/tour' element={<Tour />} />
            <Route path='/final' element={<Final/>} />
            <Route path='/retour' element={<Retour/>} />
            <Route path='/support' element={<Support/>} />
            <Route path='/tutorial' element={<Tutorial/>} />
        </Routes>
    );
};

export default RootNavigator;
