import { useEffect, useState } from "react";
import { AxiosConnect, GetLocalStorageItems } from "../services/api";
import { useNavigate } from "react-router-dom";

export const useRetour = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [entries, setEntries] = useState([]);
    const [formData, setFormData] = useState({ artikelNr: "", bezeichnung: "", menge: "", grund: "", selectedOption: "" });
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [artNr, setArtNr] = useState("");
    const [artikelNrError, setArtikelNrError] = useState("");
    const [devName, setDevName] = useState("");
    const [grundOptions, setGrundOptions] = useState([]);
    const [showErrors, setShowErrors] = useState(false);
    const [maxMenge, setMaxMenge] = useState(0);
    const [kundeNummer, setKundeNummer] = useState("");
    const [isKundePopupOpen, setIsKundePopupOpen] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const deviceName = GetLocalStorageItems('device_id');
        setDevName(deviceName);
        getGrundOptions();
        setIsKundePopupOpen(true);
    }, []);

    const handleKundeNummerSubmit = () => {
        if (kundeNummer.trim() === "") {
        alert("Kundennummer darf nicht leer sein!");
        return;
        }
        setIsKundePopupOpen(false);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleArtikelNrInput = (e) => {
        const value = e.target.value;
        setArtNr(value);
        setArtikelNrError("");
    };

    const handleArtikelNrKeyDown = (e) => {
        if (e.key === "Enter" && artNr.trim() !== "") {
        handleOpenPopup();
        }
    };

    const handleRadioChange = (e) => {
        setFormData({ ...formData, selectedOption: e.target.value });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.artikelNr) newErrors.artikelNr = "This field is required";
        if (!formData.bezeichnung) newErrors.bezeichnung = "This field is required";
        if (!formData.menge) newErrors.menge = "This field is required";
        if (!formData.grund) newErrors.grund = "This field is required";
        if (!formData.selectedOption) newErrors.selectedOption = "Please select an option";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddEntry = () => {
        setShowErrors(true);
        if (!validateForm()) return;
        setEntries([{ ...formData, kundeNummer }, ...entries]);
        setFormData({ artikelNr: "", bezeichnung: "", menge: "", grund: "", selectedOption: "" });
        setIsPopupOpen(false);
        setShowErrors(false);
    };

    const handleDelete = (index) => {
        if (window.confirm("Möchten Sie diesen Artikel wirklich löschen?")) {
        setEntries(entries.filter((_, i) => i !== index));
        }
    };

    const handleSave = () => {
        console.log(JSON.stringify(entries, null, 2));
        setEntries([]);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleOpenPopup = () => {
        if (artNr.trim() === "") {
        setArtikelNrError("KD-NR cannot be empty!");
        return;
        }
        AxiosConnect('POST', "kis_scan_article", devName, artNr)
        .then((response) => {
            const articleData = response[2];
            if (articleData) {
            const maxQuantity = articleData.menge || 0;
            setFormData({
                ...formData,
                artikelNr: articleData.eg_arnr || "",
                bezeichnung: articleData.bez7 || "",
                menge: maxQuantity.toString(),
                grund: "",
                selectedOption: ""
            });
            setMaxMenge(maxQuantity);
            }
            setErrors({});
            setShowErrors(false);
            setIsPopupOpen(true);
        })
        .catch((error) => {
            console.log(error);
            alert('Error', 'Beim Abrufen der Daten ist ein Fehler aufgetreten.', [{ text: 'OK' }]);
        });
        setArtNr("");
    };

    const getGrundOptions = () => {
        AxiosConnect('POST', "kis_dd_grund", '', '')
        .then((response) => {
            setGrundOptions(response);
        })
        .catch((error) => {
            console.log(error);
            alert('Error', 'Beim Abrufen der Daten ist ein Fehler aufgetreten.', [{ text: 'OK' }]);
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

    return {
        isPopupOpen, setIsPopupOpen, entries, formData, errors, showSuccess, artNr, artikelNrError,
        grundOptions, showErrors, maxMenge, kundeNummer, isKundePopupOpen, handleKundeNummerSubmit,
        handleInputChange, handleArtikelNrInput, handleArtikelNrKeyDown, handleRadioChange, handleAddEntry,
        handleDelete, handleSave, handleOpenPopup, handleIncrement, handleDecrement
    };
};