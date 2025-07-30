import { useNavigate } from 'react-router-dom';
import { ButtonPrimary } from '../../Components';
import './Support.css';
import { useEffect, useState } from 'react';
import { AxiosConnect, OptimizerConnect } from '../../Services';

const Support = () => {
  const [chromeVersion, setChromeVersion] = useState("");
  const defaultLat = 47.793682496234;
  const defaultLng = 12.989697049214;
  const defaultTarget = [16.407398416440806, 48.27219515];
  const [locationPermission, setLocationPermission] = useState("");
  const [apiAvailable, setApiAvailable] = useState("");
  const [optimierungAvailable, setOptimierungAvailable] = useState("");
  const [diagnoseStarted, setDiagnoseStarted] = useState(false);
  const [localStorageDeviceId, setLocalStorageDeviceId] = useState("");
  const [warningMessages, setWarningMessages] = useState([]);
  const navigate = useNavigate();
  const suggestedSolution1 = "Überprüfen Sie die Netzwerkverbindung und versuchen Sie es erneut";
  const suggestedSolution2 = "Versuchen Sie, die Anwendung neu zu starten";
  const suggestedSolution3 = "Wenn das Problem weiterhin besteht, senden Sie das Gerät an HIM-IT zur Problembehebung";
  const [fullscreenEntered, setFullscreenEntered] = useState(false);
  const [customAlert, setCustomAlert] = useState({ show: false, message: "", onConfirm: null, type: "default" });

  // مستمع لدخول وضع ملء الشاشة عند النقر
  useEffect(() => {
    const enterFullscreen = () => {
      const element = document.documentElement;
      if (!fullscreenEntered && !document.fullscreenElement) {
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

  // مستمع للتحقق من وضع ملء الشاشة كل 10 ثوانٍ
  /* useEffect(() => {
    const checkFullscreen = () => {
      if (!document.fullscreenElement && !customAlert.show) {
        setCustomAlert({
          show: true,
          message: "Bitte wechseln Sie in den Vollbildmodus, um fortzufahren.",
          onConfirm: () => {
            const element = document.documentElement;
            try {
              element.requestFullscreen().then(() => {
                // نجاح الدخول إلى ملء الشاشة، إغلاق الرسالة تلقائيًا
                setFullscreenEntered(true);
                setCustomAlert({ show: false, message: "", onConfirm: null, type: "default" });
              }).catch((error) => {
                console.error('Failed to enter fullscreen mode:', error);
                setCustomAlert({
                  show: true,
                  message: "Der Vollbildmodus konnte nicht aktiviert werden. Bitte versuchen Sie es erneut.",
                  onConfirm: null,
                  type: "error"
                });
              });
            } catch (error) {
              console.error('Failed to enter fullscreen mode:', error);
            }
          },
          type: "fullscreen"
        });
      }
    };

    // تشغيل الفحص الأولي
    checkFullscreen();

    // تشغيل الفحص كل 10 ثوانٍ
    const intervalId = setInterval(checkFullscreen, 5000);

    return () => clearInterval(intervalId);
  }, [customAlert.show]); */

  const refreshPage = () => {
    const userConfirmed = window.confirm("Möchten Sie die App wirklich neu starten? \nAlle bisher gescannten Lieferscheine werden gelöscht.");
    if (userConfirmed) {
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
      navigate('/');
      window.location.reload(true);
    }
  };

  const handleDiagnose = async () => {
    setDiagnoseStarted(true);
    setWarningMessages([]);

    const rawVersion = navigator.userAgent.match(/Chrome\/([\d.]+)/)?.[1] || "❌ Nicht verfügbar.";
    const version = rawVersion.endsWith("0.0")
      ? `${rawVersion} (Möglicherweise unvollständig, überprüfen Sie die Chrome-Einstellungen)`
      : rawVersion;
    setChromeVersion(version);

    const majorVersion = parseInt(rawVersion.split('.')[0], 10);
    if (!isNaN(majorVersion) && majorVersion < 133) {
      setWarningMessages(prev => [
        ...prev,
        "❌ Die Chrome-Version auf Ihrem Gerät muss aktualisiert werden. Senden Sie das Gerät bitte so schnell wie möglich an HIM-IT zur Problembehebung."
      ]);
    }

    if (navigator.permissions) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
        const permissionText = permissionStatus.state === "granted" ? "✅ Erteilt" : permissionStatus.state === "denied" ? "❌ Verweigert." : "✅ Ausstehend.";
        setLocationPermission(permissionText);

        if (permissionStatus.state === "denied") {
          setWarningMessages(prev => [
            ...prev,
            "❌ Zugriff auf den Standort ist erforderlich."
          ]);
        }
      } catch (error) {
        setLocationPermission("❌ Fehler bei der Überprüfung.");
      }
    } else {
      setLocationPermission("❌ Nicht unterstützt.");
    }

    const deviceName = getLocalStorageItems('device_id');
    setLocalStorageDeviceId(deviceName);

    await tryConnectToAPI();
    await tryConnectToOptimizationServer();
  };

  const getLocalStorageItems = (localName) => {
    const localItems = localStorage.getItem(localName);
    return localItems || "❌ Die device_id ist leer.";
  };

  const tryConnectToAPI = async () => {
    const testLieferSchein = "73220730";
    const deviceName = getLocalStorageItems('device_id');
    try {
      const response = await AxiosConnect('POST', "navi_belegdaten", deviceName, testLieferSchein);
      if (response) {
        console.log(response.data);
        setApiAvailable("✅ API ist verfügbar.");
      } else {
        setApiAvailable("❌ API ist nicht verfügbar.");
      }
    } catch (error) {
      console.error(error);
      setApiAvailable("❌ Fehler: " + JSON.stringify(error));
      if (error.message && error.message.includes("Network Error")) {
        setWarningMessages(prev => [
          ...prev,
          "❌ Es kann keine Verbindung zum Api-Server hergestellt werden."
        ]);
      }
    }
  };

  const tryConnectToOptimizationServer = async () => {
    const testLieferSchein = {
      "vehicles": [
        {
          "id": 1,
          "start": [defaultLng, defaultLat],
          "end": [defaultLng, defaultLat]
        }
      ],
      "jobs": [
        {
          "id": 1,
          "location": defaultTarget
        }
      ]
    };
    try {
      const response = await OptimizerConnect(testLieferSchein);
      if (response.routes) {
        console.log(response);
        setOptimierungAvailable("✅ Optimierung-Server ist verfügbar.");
      } else {
        setOptimierungAvailable("❌ Optimierung-Server ist nicht verfügbar.");
      }
    } catch (error) {
      console.error(error);
      setOptimierungAvailable("❌ Fehler: " + JSON.stringify(error));
      if (error.message && error.message.includes("Network Error")) {
        setWarningMessages(prev => [
          ...prev,
          "❌ Es kann keine Verbindung zum Optimierung-Server hergestellt werden."
        ]);
      }
    }
  };

  // مكون النافذة المنبثقة المخصصة
  const CustomAlert = ({ message, onConfirm, type }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="sa-bg-transparent rounded-lg p-4 text-white">
      <h2 className="text-2xl font-bold text-center pb-4 text-white">Achtung!</h2>
        <p className="text-center text-white">{message}</p>
        <div className="flex justify-end mt-4 gap-2">
          {onConfirm && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={onConfirm}
            >
              OK
            </button>
          )}
          {type === "error" && (
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={() => setCustomAlert({ show: false, message: "", onConfirm: null, type: "default" })}
            >
              Schließen
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container text-white sa-bg-main-light">
      <div className="rounded-lg card-list-container p-6">
        <div className="mt-4 sa-bg-main-dark-transparent rounded-lg p-2 space-y-3 mb-4 shadow-md">
          {diagnoseStarted && (
            <div className="text-left text-gray-400 word-break: break-all text-wrap sa-bg-main-dark-transparent rounded-lg p-4">
              <h2 className="text-2xl font-bold text-center text-white bg-gray-800 p-2 rounded-md">Diagnoseergebnisse</h2>
              {localStorageDeviceId && (
                <p className="mt-2">
                  <span className="text-pink-500 font-bold text-left">Device_id: </span>
                  {localStorageDeviceId}
                </p>
              )}
              {chromeVersion && (
                <p className="mt-2">
                  <span className="text-pink-500 font-bold text-left">Installierte Chrome-Version: </span>
                  {chromeVersion}
                </p>
              )}
              {apiAvailable && (
                <p className="mt-2">
                  <span className="text-pink-500 font-bold text-left">Api verfügbar: </span>
                  {apiAvailable}
                </p>
              )}
              {optimierungAvailable && (
                <p className="mt-2">
                  <span className="text-pink-500 font-bold text-left">Optimierung-Server : </span>
                  {optimierungAvailable}
                </p>
              )}
              {locationPermission && (
                <p className="mt-2">
                  <span className="text-pink-500 font-bold text-left">Standortberechtigung: </span>
                  {locationPermission}
                </p>
              )}
              {warningMessages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-red-500 font-bold underline">Erkannte Probleme:</h3>
                  <ul className="list-disc list-inside text-red-500">
                    {warningMessages.map((message, index) => (
                      <li key={index} className="mt-1">{message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <h3 className="text-pink-600 font-bold mt-4 mb-2 underline">Lösungsvorschläge:</h3>
              <ul className="list-disc list-inside text-blue-300">
                <li className='mt-1 text-gray-800'>{suggestedSolution1}</li>
                <li className='mt-1 text-gray-800'>{suggestedSolution2}</li>
                <li className='mt-1 text-gray-800'>{suggestedSolution3}</li>
              </ul>
            </div>
          )}
          <ButtonPrimary
            title="Diagnose starten"
            onPress={handleDiagnose}
            className=""
          />
          <ButtonPrimary
            title="Neustart erzwingen"
            onPress={refreshPage}
            className=""
          />
        </div>
      </div>

      {customAlert.show && (
        <CustomAlert message={customAlert.message} onConfirm={customAlert.onConfirm} type={customAlert.type} />
      )}
    </div>
  );
};

export default Support;