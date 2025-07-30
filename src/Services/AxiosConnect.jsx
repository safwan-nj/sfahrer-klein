import axios from 'axios';

// تعريف ثابت للـ headers لأنه لن يتغير
const DEFAULT_HEADERS = {
    "Accept": "json",
    "x-cdata-authtoken": "3t9Q3l3l4U1d3u0U0i6x",
    "Content-Type": "application/json"
};

/**
 * دالة لإنشاء اتصال Axios بناءً على نوع الطلب والمعطيات
 * @param {string} type - نوع الطلب (GET, POST, etc.)
 * @param {string} func - اسم الوظيفة/الخدمة المطلوبة
 * @param {string} device_id - معرف الجهاز
 * @param {string|object} scaninput - مدخل المسح (يمكن أن يكون نصًا أو كائنًا)
 * @returns {Promise} - البيانات المرجعة من الخادم
 */
const AxiosConnect = async (type, func, device_id, scaninput) => {
    // تحديد URL الأساسي بناءً على الوظيفة
    /* const baseUrl = func === 'navi_belegdaten'
        //? 'http://localhost/apps/naviAssets/web_services/beleg_daten.php'
        ? `https://transfer.klein-autoteile.at:9153/api.rsc/${func}`
        : `https://transfer.klein-autoteile.at:9153/api.rsc/${func}`; */
    //const baseUrl = `https://transfer.klein-autoteile.at:9153/api.rsc/${func}`    // Production URL
    let baseUrl = ``;
    if (func === 'navi_belegdaten') {
    //baseUrl = 'http://localhost/apps/naviAssets/web_services/beleg_daten.php' // localhost URL
    baseUrl = 'https://transfer.klein-autoteile.at/aussendienst/safwan/naviAssets/web_services/beleg_daten_proxy/beleg_daten_proxy.php' // Out URL
    } else {
        baseUrl = `https://transfer.klein-autoteile.at:9153/api.rsc/${func}`; // localhost URL
    }
    // تهيئة كائن البيانات
    let data = {};

    // التحقق من نوع scaninput وتحديد هيكل البيانات المناسب
    if (typeof scaninput === 'string') {
        if (func === 'kis_scan_article') {
            data = JSON.stringify({
                "barcode": scaninput,
                "deviceid": device_id
            });
        } else if (func === 'kis_rma_scaninput') {
            data = JSON.stringify({
                "scaninput": scaninput
            });
        }else {
            data = JSON.stringify({
                "belegindex": scaninput,
                "device_id": device_id
            });
        }
    } else {
        data = {
            "json_input": JSON.stringify(scaninput)
        };
    }

    // إجراء الطلب باستخدام axios والإرجاع مباشرة
    const response = await axios({
        url: baseUrl,
        method: type,
        data: data,
        headers: DEFAULT_HEADERS
    });

    return response.data.value;
};

export default AxiosConnect;