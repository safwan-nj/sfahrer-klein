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
    let baseUrl = '';
    let dataToSend = {}; // تهيئة لضمان وجود قيمة افتراضية

    // تحديد URL الأساسي بناءً على الوظيفة المطلوبة
    if (func === 'kis_rma_auftrag_save') {
        baseUrl = 'http://localhost/apps/logger/log_receiver.php';
    } else if (func === 'navi_belegdaten') {
        baseUrl = 'https://transfer.klein-autoteile.at/aussendienst/safwan/naviAssets/web_services/beleg_daten_proxy/beleg_daten_proxy.php';
    } else {
        // جميع الوظائف الأخرى (مثل 'kis_scan_article', 'kis_rma_scaninput', 'kis_dd_grund' وغيرها)
        baseUrl = `https://transfer.klein-autoteile.at:9153/api.rsc/${func}`;
    }

    // التحقق من نوع scaninput وتحديد هيكل البيانات المناسب
    if (typeof scaninput === 'string') {
        if (func === 'kis_scan_article') {
            dataToSend = JSON.stringify({
                "barcode": scaninput,
                "deviceid": device_id
            });
        } else if (func === 'kis_rma_scaninput') {
            dataToSend = JSON.stringify({
                "scaninput": scaninput
            });
        } else if (func === 'kis_dd_grund') {
            // هذا التعديل المحدد: إرسال جسم JSON فارغ لـ kis_dd_grund
            dataToSend = {};
        } else {
            // الاستخدام الافتراضي لأي دالة أخرى تتطلب 'belegindex' و 'device_id'
            dataToSend = JSON.stringify({
                "belegindex": scaninput,
                "device_id": device_id
            });
        }
    } else { // إذا كان scaninput كائنًا (مثل البيانات المرسلة لدالة الحفظ 'kis_rma_auftrag_save')
        dataToSend = {
            "json_input": JSON.stringify(scaninput)
        };
    }

    // إجراء الطلب باستخدام axios والإرجاع مباشرة
    const response = await axios({
        url: baseUrl,
        method: type,
        data: dataToSend, // استخدم البيانات المهيأة
        headers: DEFAULT_HEADERS
    });

    return response.data.value;
};

export default AxiosConnect;