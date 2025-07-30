import { useEffect, useState } from "react";

const EnterFullScreen = () => {
    const [fullscreenEntered, setFullscreenEntered] = useState(false);
    const element = document.querySelector('.app-container');

    // Function to enter full screen mode
    function handleFullScreen() {
        if (element && !fullscreenEntered) {
            try {
                element.requestFullscreen();
                setFullscreenEntered(true);
            } catch (error) {
                console.error('Failed to enter fullscreen mode:', error);
            }
        }
    }
    // Listen for changes in full screen
    useEffect(() => {
        document.addEventListener('click', handleFullScreen);
        return () => {
            document.removeEventListener('click', handleFullScreen);
        };
    }, [fullscreenEntered]);

    return (
        <>
            <button onClick={handleFullScreen}>Enter Full Screen</button>
        </>
    );

};

export default EnterFullScreen