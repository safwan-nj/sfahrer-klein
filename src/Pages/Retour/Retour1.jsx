import { useEffect, useState, useRef } from "react";
import { ButtonPrimary, InputPrimary } from '../../Components';
import { AxiosConnect, GetLocalStorageItems } from "../../Services";
import * as FaIcons from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import CustomerCard from "./CustomerCard";
import ArtikelCard from "./ArtikelCard";
import CustomerPopup from "./CustomerPopup";
import ArtikelPopup from "./ArtikelPopup";

const Retour = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({ artikelNr: "", bezeichnung: "", menge: "", grund: "", selectedOption: "", artikelHersteller: "", artikelLfdNr: "" });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [artNr, setArtNr] = useState("");
  const [artikelNrError, setArtikelNrError] = useState("");
  const [devName, setDevName] = useState("");
  const [grundOptions, setGrundOptions] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const [maxMenge, setMaxMenge] = useState(0);
  const [kundeNummer, setKundeNummer] = useState("");
  const [kundeKontonr, setKundeKontonr] = useState("");
  const [kundeLfdNr, setKundeLfdNr] = useState("");
  const [kundeName, setKundeName] = useState("");
  const [kundeMail, setKundeMail] = useState("");
  const [originalKundeMail, setOriginalKundeMail] = useState("");
  const [isKundePopupOpen, setIsKundePopupOpen] = useState(false);
  const [inputPlaceholder, setInputPlaceholder] = useState("LS QR-Code Scannen");
  const [artikelAltteilAvailable, setArtikelAltteilAvailable] = useState(null);
  const [customAlert, setCustomAlert] = useState({ show: false, message: "", onConfirm: null, type: "default" });
  const [showKeyboard, setShowKeyboard] = useState(false); // حالة للتحكم في إظهار لوحة المفاتيح
  const navigate = useNavigate();
  const [fullscreenEntered, setFullscreenEntered] = useState(false);
  const inputRef = useRef(null);

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

  useEffect(() => {
    const deviceName = GetLocalStorageItems('device_id');
    setDevName(deviceName);
    getGrundOptions();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!isKundePopupOpen && !isPopupOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isKundePopupOpen, isPopupOpen]);

  useEffect(() => {
    const checkFocusAndFullscreen = () => {
      if (document.activeElement !== inputRef.current && !isPopupOpen && !isKundePopupOpen && inputRef.current) {
        inputRef.current.focus();
      }
    };

    const intervalId = setInterval(checkFocusAndFullscreen, 5000);

    return () => clearInterval(intervalId);
  }, [isPopupOpen, isKundePopupOpen, customAlert.show]);

  const CustomAlert = ({ message, onConfirm, type }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="sa-bg-transparent rounded-lg p-4 text-white">
        <h2 className="text-2xl font-bold text-center text-white pb-4">Achtung!</h2>
        <p className="text-sm text-white">{message}</p>
        <div className="flex justify-end mt-4 gap-2">
          {type === "default" && (
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setCustomAlert({ show: false, message: "", onConfirm: null, type: "default" });
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
            >
              Abbrechen
            </button>
          )}
          <button
            className="bg-pink-600 text-white px-4 py-2 rounded"
            onClick={() => {
              onConfirm();
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );

  const handleKundeNummerSubmit = () => {
    setIsKundePopupOpen(false);
    setInputPlaceholder("Artikel-Barcodenummer");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleEditKunde = () => {
    setIsKundePopupOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleKundeInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "kundeNummer":
        setKundeNummer(value);
        break;
      case "kundeName":
        setKundeName(value);
        break;
      case "kundeKontonr":
        setKundeKontonr(value);
        break;
      case "kundeLfdNr":
        setKundeLfdNr(value);
        break;
      case "kundeMail":
        setKundeMail(value);
        break;
      default:
        break;
    }
  };

  const handleArtikelNrInput = (e) => {
    const value = e.target.value;
    setArtNr(value);
    setArtikelNrError("");
    if (value.trim() !== "") {
      handleOpenPopup(value);
    }
  };

  const handleRadioChange = (e) => {
    setFormData({ ...formData, selectedOption: e.target.value, grund: e.target.value === "Alt" ? "" : formData.grund });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.artikelNr) newErrors.artikelNr = "Dieses Feld ist erforderlich";
    if (!formData.bezeichnung) newErrors.bezeichnung = "Dieses Feld ist erforderlich";
    if (!formData.menge) newErrors.menge = "Dieses Feld ist erforderlich";
    if ((formData.selectedOption === "Neu" || artikelAltteilAvailable === 0) && !formData.grund) newErrors.grund = "Dieses Feld ist erforderlich";
    if (artikelAltteilAvailable !== 0 && !formData.selectedOption) newErrors.selectedOption = "Bitte wählen Sie eine Option";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEntry = () => {
    setShowErrors(true);
    if (!validateForm()) return;
    
    const updatedFormData = {
      ...formData,
      selectedOption: artikelAltteilAvailable === 0 ? "Neu" : formData.selectedOption
    };
    
    setEntries([{ ...updatedFormData, kundeNummer }, ...entries]);
    setFormData({ artikelNr: "", bezeichnung: "", menge: "", grund: "", selectedOption: "", artikelHersteller: "", artikelLfdNr: "" });
    setIsPopupOpen(false);
    setShowErrors(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleDelete = (index) => {
    setCustomAlert({
      show: true,
      message: "Möchten Sie diesen Artikel wirklich löschen?",
      onConfirm: () => {
        setEntries(entries.filter((_, i) => i !== index));
        setCustomAlert({ show: false, message: "", onConfirm: null, type: "default" });
        if (inputRef.current) {
          inputRef.current.focus();
        }
      },
      type: "default"
    });
  };

  const handleSave = () => {
    setCustomAlert({
      show: true,
      message: `Sind Sie sicher, dass Sie alle Elemente gescannt haben und jetzt speichern möchten? \nSie haben ${entries.length} Artikel gescannt.`,
      onConfirm: () => {
        const formattedData = {
          devicename: devName || "KLASC999",
          kunde_lfd_nr: kundeLfdNr || "",
          kunde_re_mail: kundeMail === originalKundeMail ? "" : kundeMail || "",
          articles: entries.map((entry, index) => ({
            artikel_sort: ((index + 1) * 10).toString(),
            artikel_lfdnr: entry.artikelLfdNr || "0",
            artikel_eancode: entry.artikelNr,
            artikel_menge: entry.menge,
            artikel_isAltteil: entry.selectedOption === "Alt" ? "1" : "0",
            artikel_grund: grundOptions.find(option => option.dd_grund_text === entry.grund)?.dd_grund_index || ""
          }))
        };
  
        AxiosConnect('POST', "kis_rma_auftrag_save", '', formattedData)
          .then((response) => {
            const auftragIndex = response[0].auftrag_index;
            setEntries([]);
            setCustomAlert({
              show: true,
              message: `Ihr Antrag wurde erfolgreich unter der Nummer ${auftragIndex} gespeichert!\nMöchten Sie eine neue Rückgabe starten?`,
              onConfirm: () => {
                setKundeNummer("");
                setKundeKontonr("");
                setKundeLfdNr("");
                setKundeName("");
                setKundeMail("");
                setOriginalKundeMail("");
                setInputPlaceholder("LS QR-Code Scannen");
                setCustomAlert({ show: false, message: "", onConfirm: null, type: "default" });
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              },
              type: "default"
            });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
          })
          .catch((error) => {
            setCustomAlert({
              show: true,
              message: "Fehler beim Speichern. Bitte versuchen Sie es erneut.",
              onConfirm: () => {
                setCustomAlert({ show: false, message: "", onConfirm: null, type: "default" });
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              },
              type: "default"
            });
          });
  
        setCustomAlert({ show: false, message: "", onConfirm: null, type: "default" });
      },
      type: "default"
    });
  };

  const handleOpenPopup = (inputValue = artNr) => {
    if (inputValue.trim() === "") {
      setArtikelNrError("QR-Code darf nicht leer sein!");
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }
  
    if (!kundeNummer) {
      const qrCodePattern = /\*\d{3}#$/.test(inputValue);
      if (!qrCodePattern) {
        setCustomAlert({
          show: true,
          message: 'Bitte scannen Sie den QR-Code auf dem LS zuerst, um die Kundendaten abzurufen!',
          onConfirm: () => {
            setArtNr("");
            setCustomAlert({ show: false, message: "", onConfirm: null, type: "default" });
            if (inputRef.current) {
              inputRef.current.focus();
            }
          },
          type: "default"
        });
        return;
      }
    }
  
    AxiosConnect('POST', "kis_rma_scaninput", '', inputValue)
      .then((response) => {
        const articleData = response[0];
        console.log('articleData:::', response);
        if (articleData) {
          if (articleData.response === "isArticle") {
            const maxQuantity = articleData.artikel_menge || 0;
            setFormData({
              ...formData,
              artikelNr: articleData.artikel_artikelnr || 
                        (articleData.artikel_bezeichnung ? 
                          articleData.artikel_bezeichnung.replace(/[^0-9]/g, '') : 
                          "0x0000000"),
              bezeichnung: articleData.artikel_bezeichnung || "",
              artikelHersteller: articleData.artikel_hersteller || "",
              artikelLfdNr: articleData.artikel_lfdnr || "0",
              menge: maxQuantity.toString(),
              grund: "",
              selectedOption: ""
            });
            setMaxMenge(maxQuantity);
            setArtikelAltteilAvailable(parseInt(articleData.artikel_altteilavailable, 10) || 0);
            setIsPopupOpen(true);
          } else if (articleData.response === "isCustomer") {
            setKundeKontonr(articleData.kunde_kontonr || "");
            setKundeLfdNr(articleData.kunde_lfd_nr || "");
            setKundeName(articleData.kunde_name || "");
            setKundeMail(articleData.kunde_re_mail || "");
            setOriginalKundeMail(articleData.kunde_re_mail || "");
            setKundeNummer(articleData.kunde_kontonr || "");
            setIsKundePopupOpen(true);
          }
        }
        setErrors({});
        setShowErrors(false);
        setArtNr("");
        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .catch((error) => {
        setCustomAlert({
          show: true,
          message: 'Beim Abrufen der Daten ist ein Fehler aufgetreten. Bitte überprüfen Sie die Nummer وجرب مرة أخرى.',
          onConfirm: () => {
            setArtNr("");
            setCustomAlert({ show: false, message: "", onConfirm: null, type: "default" });
            if (inputRef.current) {
              inputRef.current.focus();
            }
          },
          type: "default"
        });
      });
  };

  const getGrundOptions = () => {
    AxiosConnect('POST', "kis_dd_grund", '', '')
      .then((response) => {
        setGrundOptions(response);
      })
      .catch((error) => {
        setCustomAlert({
          show: true,
          message: 'Beim Abrufen der Daten ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
          onConfirm: null,
          type: "default"
        });
      });
  };

  const handleIncrement = () => {
    const currentMenge = parseInt(formData.menge) || 1;
    if (currentMenge < maxMenge) {
      setFormData({ ...formData, menge: (currentMenge + 1).toString() });
    }
  };

  const handleDecrement = () => {
    const currentMenge = parseInt(formData.menge) || 1;
    if (currentMenge > 1) {
      setFormData({ ...formData, menge: (currentMenge - 1).toString() });
    }
  };

  const handleShowKeyboard = () => {
    setShowKeyboard(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className='retour-container h-full'>
      <div className="text-white relative flex flex-col min-h-screen overflow-y-hidden">
        <div className={`sa-bg-main-light flex flex-col flex-grow overflow-y-hidden ${isKundePopupOpen || isPopupOpen ? 'pointer-events-none opacity-50' : ''}`}>
          {/* الجزء العلوي (بطاقة العميل وحقل البحث) */}
          <div className={`${kundeNummer ? 'sa-bg-main-light' : ''} sticky top-0 z-20 px-8 rounded-md pt-2`}>
            {kundeNummer && (
              <CustomerCard 
                kundeName={kundeName} 
                kundeNummer={kundeNummer} 
                kundeKontonr={kundeKontonr} 
                kundeMail={kundeMail} 
                handleEditKunde={handleEditKunde} 
              />
            )}
            <div className="pr-3 pl-3 pt-1 pb-1 rounded-full sa-bg-main-dark-transparent -mx-6">
              <div className="flex items-center gap-2 p-1 relative">
                <p className='text-xs font-semibold sa-text-main-secondary'>Retour:</p>
                <FaIcons.FaSistrix className="sa-text-main-dark w-6 h-6" />
                <InputPrimary
                  innerRef={inputRef}
                  type="text"
                  maxLength={13}
                  value={artNr}
                  autoFocus={true}
                  className="w-screen rounded-full mr-12"
                  placeholder={inputPlaceholder}
                  onChange={handleArtikelNrInput}
                  inputMode={showKeyboard ? "text" : "none"}
                  roundSet="rounded-full"
                  disabled={isKundePopupOpen || isPopupOpen}
                />
                <button
                  onClick={handleShowKeyboard}
                  className="absolute right-1 p-2 sa-bg-main-secondary rounded-full text-white"
                  title="Tastatur anzeigen"
                >
                  <FaIcons.FaKeyboard className="w-5 h-5" />
                </button>
              </div>
              {artikelNrError && <div className="text-red-500 mt-2">{artikelNrError}</div>}
            </div>
          </div>

          {/* الحاوية الوسطى لعرض العناصر (ثابتة مع تمرير داخلي) */}
          {entries.length > 0 && (
            <div className="flex-grow px-3">
              <div className="mt-2 rounded-xl sa-bg-main-dark-transparent px-2 py-3 h-[59vh]" style={{ overflowY: 'scroll' }}>
                {entries.map((entry, index) => (
                  <ArtikelCard
                    key={index}
                    index={index}
                    kundeNummer={entry.kundeNummer}
                    artikelNr={entry.artikelNr}
                    bezeichnung={entry.bezeichnung}
                    artikelHersteller={entry.artikelHersteller}
                    menge={entry.menge}
                    selectedOption={entry.selectedOption}
                    handleDelete={handleDelete}
                    grund={entry.grund}
                  />
                ))}
              </div>
            </div>
          )}

          {/* الجزء السفلي (زر الحفظ) */}
          {entries.length > 0 && (
            <div className="sticky bottom-9 z-20 px-3 py-2">
              <div 
                className="sa-bg-main-dark-transparent rounded-2xl"
                style={{
                  backgroundColor: "white",
                  padding: 2,
                  borderRadius: 20,
                  marginTop: 10,
                  width: "100%",
                }}
              >
                <ButtonPrimary
                  onPress={handleSave}
                  title={`Speichern ${entries.length} Artikel`}
                />
              </div>
            </div>
          )}

          {showSuccess && <div className="text-green-500 mt-4 px-12">Daten erfolgreich gespeichert!</div>}
        </div>

        {isPopupOpen && (
          <ArtikelPopup
            showErrors={showErrors}
            errors={errors}
            formData={formData}
            grundOptions={grundOptions}
            maxMenge={maxMenge}
            artikelAltteilAvailable={artikelAltteilAvailable}
            handleInputChange={handleInputChange}
            handleRadioChange={handleRadioChange}
            handleIncrement={handleIncrement}
            handleDecrement={handleDecrement}
            handleAddEntry={handleAddEntry}
            setIsPopupOpen={setIsPopupOpen}
            setShowErrors={setShowErrors}
            setErrors={setErrors}
          />
        )}

        {isKundePopupOpen && (
          <CustomerPopup
            kundeNummer={kundeNummer}
            kundeName={kundeName}
            kundeKontonr={kundeKontonr}
            kundeMail={kundeMail}
            handleKundeInputChange={handleKundeInputChange}
            handleKundeNummerSubmit={handleKundeNummerSubmit}
          />
        )}

        {customAlert.show && (
          <CustomAlert message={customAlert.message} onConfirm={customAlert.onConfirm} type={customAlert.type} />
        )}
      </div>
    </div>
  );
}

export default Retour;