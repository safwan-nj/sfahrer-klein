
const GetCurrentCoordinates = () => {
    const fetchData = async () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                },
                (error) => {
                    console.error('Error getting location:', error.message);
                    reject(error);
                }
            );
        });
    };

    return fetchData();
};

export default GetCurrentCoordinates;
