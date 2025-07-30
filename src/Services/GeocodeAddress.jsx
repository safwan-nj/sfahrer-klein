import axios from 'axios';

/* ترجمة العنوان الى احداثيات */
  const GeocodeAddress = async (address) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          format: 'json',
          q: address
        }
      });
  
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      } else {
        throw new Error('No coordinates found for the address');
      }
    } catch (error) {
      throw new Error('Error geocoding address: ' + error.message);
    }
  };

  export default GeocodeAddress;