import axios from 'axios';

const OptimizerConnect = async (organizedData) => {
    //const baseUrl = `http://192.168.10.60:3000`;      //KLE_OP_Server
    //const baseUrl = `http://192.168.1.116:3000`;      //SAFI_OP_Server
    //const baseUrl = `http://solver.vroom-project.org`;
    const baseUrl = `https://transfer.klein-autoteile.at/aussendienst/safwan/naviAssets/web_services/optimizer_connect.php`;             //KLE_API_Server
    //const baseUrl = `http://localhost/apps/naviAssets/web_services/optimizer_connect.php`;               //SAFI_API_Local_Server
    const headers = {
        "Accept": "json",
    };
    const response = await axios({
        url: baseUrl,
        method: "POST",
        data: organizedData,
        dataResponse: "json",
        headers: headers
    }).then(response => {
        // Remove the "geometry" key from the response
        delete response.data.routes[0].geometry;
        return response.data;
    });
    return response;
}

export default OptimizerConnect;
