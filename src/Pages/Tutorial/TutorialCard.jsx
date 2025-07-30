import tut1 from '../../assets/images/tut1.png';
import tut2 from '../../assets/images/tut2.png';
import tut3 from '../../assets/images/tut3.png';
import tut4 from '../../assets/images/tut4.png';
import tut5 from '../../assets/images/tut5.png';
import tut71 from '../../assets/images/tut71.png';
import tut72 from '../../assets/images/tut72.png';
import tut73 from '../../assets/images/tut73.png';
import tut74 from '../../assets/images/tut74.png';
import tut75 from '../../assets/images/tut75.png';
import tut76 from '../../assets/images/tut76.png';
import tut6 from '../../assets/images/tut6.png';
import tut8 from '../../assets/images/tut8.png';
import tut9 from '../../assets/images/tut9.png';
import klLogo from '../../assets/klLogo.png';
import icon from '../../assets/icon192.png';
import wichtig from '../../assets/wicht.png';

import retour1 from '../../assets/images/retour1.png';
import retour2 from '../../assets/images/retour2.png';
import retour3 from '../../assets/images/retour3.png';
import retour4 from '../../assets/images/retour4.png';
import retour5 from '../../assets/images/retour5.png';
import retour6 from '../../assets/images/retour6.png';
import retour7 from '../../assets/images/retour7.png';
import support1 from '../../assets/images/support1.png';
import support2 from '../../assets/images/support2.png';
import support3 from '../../assets/images/support3.png';

const TutorialCard = ({ imagePath }) => {
  let imag, detls, detls1, detls2, detls3, detls4, detls5, detls6, detls7, detls8, icn, fin, wichtg;
  switch (imagePath) {
    case 'tut1':
      imag = tut1;
      detls = 'Der erste Bildschirm beim Öffnen des Programms';
      break;
    case 'tut2':
      imag = tut2;
      detls = 'Scannen Sie den QR-Code, der in das Eingabefeld eingegeben werden soll';
      break;
    case 'tut3':
      imag = tut3;
      detls = 'Die Details des Lieferscheins werden Ihnen sofort angezeigt';
      break;
    case 'tut4':
      imag = tut4;
      detls = 'Nachdem wir mehrere Lieferscheine gescannt haben, sehen wir oben den finanziellen Wert der gesamten Lieferscheine und unten die geschätzte Zeit bis zur Fertigstellung der Tour.';
      break;
    case 'tut5':
      imag = tut5;
      detls = 'Die erweiterte Tour wird Ihnen angezeigt, nachdem Sie auf die Schaltfläche „Vorschau“ geklickt haben';
      break;
    case 'tut6':
      imag = tut6;
      detls = "Durch einen Klick auf den Button „Losfahren“ wird das Tourenliste angezeigt, in dem Sie durch einen Klick auf den Button „Go“ direkt Ihr Ziel auswählen können.";
    break;
    case 'tut71':
      imag = tut71;
      detls = 'Nach einem Klick auf die Schaltfläche „Maps“ führt Sie Google Maps optimal zu Ihrem Ziel. Bei Ihrer Ankunft klicken Sie auf die Schaltfläche „Stift“, um die folgende Optionsseite anzuzeigen';
      break;
    case 'tut72':
      imag = tut72;
      detls = 'Wählen Sie die entsprechende Option für Ihre Versandart, indem Sie auf das Dropdown-Menü klicken';
      break;
    case 'tut73':
      imag = tut73;
      detls = 'Einige lösen eine Signaturschaltfläche aus';
      break;
    case 'tut74':
      imag = tut74;
      detls = 'Bei anderen wird eine Schaltfläche zum Aufnehmen eines Fotos angezeigt';
      break;
    case 'tut75':
      imag = tut75;
      detls = 'Geben Sie den Namen des Empfängers in das Eingabefeld oben ein und drücken Sie die Eingabetaste auf der Tastatur, oder klicken Sie auf die nebenstehende Schaltfläche mit dem Häkchen-Zeichen, um den Namen zu speichern, und bitten Sie ihn dann, die Quittung an der dafür vorgesehenen Stelle zu unterschreiben. Klicken Sie dann auf das Speichersymbol in der oberen rechten Ecke (pink Farbe).';
      break;
    case 'tut76':
      imag = tut76;
      detls = 'Bei Fotos wird nach der Aufnahme eine Vorschau des Bildes angezeigt. Zum Speichern klicken Sie auf das Häkchensymbol (blaue Farbe) unterhalb des Bildes.';
      break;
    
    case 'tut8':
      imag = tut8;
      detls = 'Über die Seitenleiste können Sie zwischen den Anwendungsbereichen navigieren.';
      break;
    case 'tut9':
      imag = tut9;
      detls = 'Wenn Sie mit der Übermittlung aller Lieferscheine fertig sind, wählen Sie „Final“ aus der Seitenleiste, oder klicken Sie auf die Schaltfläche „Zurück zur Filiale“, die am Ende der Lieferungsliste angezeigt wird';
      break;
    
    case 'retour1':
      imag = retour1;
      detls = 'Beim Aufrufen der Seite "Retour" erscheint oben auf der Hauptoberfläche ein Eingabefeld, in dem Sie aufgefordert werden, die Lieferscheinnummer zu scannen';
    break;
    case 'retour2':
      imag = retour2;
      detls = 'Nach dem Scannen des QR-Codes vom Lieferschein erscheint ein Popup-Fenster mit den Kundeninformationen. Nur die E-Mail-Adresse kann geändert werden 😉';
    break;
    case 'retour3':
      imag = retour3;
      detls = 'Hauptschnittstelle nach Bestätigung der Kundeninformationen.\nAchtung: Im Eingabefeld nun den Barcode auf dem Artikel scannen.';
    break;
    case 'retour4':
      imag = retour4;
      detls = 'Nach dem Scannen des Barcodes auf dem Artikel wird ein Popup-Fenster mit den Artikelinformationen angezeigt';
    break;
    case 'retour5':
      imag = retour5;
      detls = 'Bei einigen Artikeln können die Optionen leicht abweichen, daher müssen Sie Folgendes auswählen: Neu | Alt';
    break;
    case 'retour6':
      imag = retour6;
      detls = 'Bei Auswahl von: Neu; Der Grund der Rücksendung muss angegeben werden';
    break;
    case 'retour7':
      imag = retour7;
      detls = 'Die Hauptschnittstelle nach dem Scannen aller zurückzugebenden Artikel (Max 12 Artikel Pro/RS).';
    break;
    case 'support1':
      imag = support1;
      detls = 'Support: Die Hauptschnittstelle enthält zwei Schaltflächen: Diagnose starten & Neustart erzwindzgen.';
    break;
    case 'support2':
      imag = support2;
      detls = 'Das Bild zeigt, wenn ein Mann auf Diagnose starten klickt, falls ein Fehler gefunden wird.';
    break;
    case 'support3':
      imag = support3;
      detls = 'Das Bild zeigt, wenn der Mann auf Diagnose starten klickt, falls kein Fehler gefunden wird';
    break;

    case 'wichtig':
      imag = wichtig;
      detls = 'Wichtige Hinweise zur Anwendung:';
      detls1 = '1- Wenn die QR-CODE-Nummer aufgrund eines schlechten Drucks unleserlich ist, können Sie auf die Tastaturschaltfläche klicken, um die unter dem QR-CODE angegebene Nummer manuell einzugeben.';
      detls2 = '2- Einige Optionen müssen manuell ausgewählt werden. Z.B: Wenn Sie auf die Schaltfläche „Bestätigen“ klicken, ohne sie auszuwählen, werden die fehlenden Elemente rot angezeigt (vorheriges Bild).';
      detls3 = '3- Alle Einträge erscheinen in der Mitte und können zum Prüfen durchgeblättert werden.';
      detls4 = '4- Das zuletzt gescannte Element wird ganz oben angezeigt.';
      detls5 = '5- Sie können alle falschen Elemente nur löschen.';
      detls6 = '6- Um das Hinzufügen eines neuen Artikels zu vereinfachen, sind die Kundenkarte und das Eingabefeld immer oben fixiert';
      detls7 = '7- Der Speichern-Button befindet sich immer ganz unten und zeigt Ihnen die Gesamtzahl der eingegebenen Artikel an.';
      detls8 = '8- Wenn Sie auf die „Löschen“ klicken, werden Sie von der Anwendung aufgefordert, den Vorgang zu bestätigen oder abzubrechen.';
      wichtg = true;
      break;
    case 'tut10':
      imag = icon;
      detls = 'Beim Speichern der Unterschrift | des Bildes werden erledigte Lieferscheine dunkel und mit einem blauen Häkchen in der oberen rechten Ecke markiert, während die noch zu liefernden Lieferscheine hell dargestellt werden.';
      detls1 = 'Herzlichen Glückwunsch, denn Sie haben den Bildungsabschnitt abgeschlossen und sind jetzt bereit, die Reise zu beginnen. Um jetzt mit der Einreichung von Lieferscheinen zu beginnen, klicken Sie hier';
      icn = klLogo;
      fin = true;
      break;
    default:
      imag = null;
      detls = '';
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="w-full max-w-md sa-bg-main-dark-transparent p-4 text-black text-xs font-semibold flex items-center justify-center">
        <p className="text-center">{detls}</p>
      </div>
      <div className="w-full max-w-md sa-bg-light-transparent rounded-b-xl p-4 flex justify-center">
        <img
          src={imag}
          alt="Tutorial"
          className={`${imag !== icon && imag !== wichtig ? 'w-full h-[480px] rounded-lg object-fill pb-4' : imag == icon ? 'w-20 h-20 rounded-full p-2' : 'w-full h-14 object-fill rounded-lg m-0'} max-w-xs shadow-lg`}
        />
      </div>
      {fin && (
        <div className="w-full max-w-md sa-bg-main-dark-transparent p-4 flex flex-col items-center">
          <a
            href="/aussendienst/safwan/sfahrer/"
            className="text-lg font-semibold text-pink-700 hover:text-pink-500"
          >
            <p className="text-center text-sm mt-12">{detls1}</p>
          </a>
          <img
            src={icn}
            alt="Tutorial Icon"
            className="w-24 h-24 object-scale-down rounded-lg mt-6"
          />
        </div>
      )}
      {wichtg && (
        <div className="w-full max-w-md sa-bg-main-dark-transparent p-3 px-7 flex flex-col items-start rounded-lg">
          <p className="text-left text-gray-800 text-xs">{detls1}</p>
          <p className="text-left text-gray-800 text-xs mt-2">{detls2}</p>
          <p className="text-left text-gray-800 text-xs mt-2">{detls3}</p>
          <p className="text-left text-gray-800 text-xs mt-2">{detls4}</p>
          <p className="text-left text-gray-800 text-xs mt-2">{detls5}</p>
          <p className="text-left text-gray-800 text-xs mt-2">{detls6}</p>
          <p className="text-left text-gray-800 text-xs mt-2">{detls7}</p>
          <p className="text-left text-gray-800 text-xs mb-7">{detls8}</p>
        </div>
      )}
    </div>
  );
};

export default TutorialCard;