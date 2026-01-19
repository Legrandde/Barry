import { AiOutlineAppstore } from "react-icons/ai";
import { FaCalendarAlt, FaChevronRight, FaCloud, FaCreditCard, FaEdit, FaFacebook, FaFileAlt, FaFilePdf, FaIdCard, FaImage, FaInstagram, FaLayerGroup, FaLock, FaMailBulk, FaMapMarkerAlt, FaMusic, FaNetworkWired, FaPhoneAlt, FaReceipt, FaShareAlt, FaSms, FaSyncAlt, FaTree, FaTwitter, FaUserAlt, FaUtensils, FaWifi, FaWpforms, FaYoutube } from "react-icons/fa";
import { FiLink } from "react-icons/fi";
import { IoGlobeOutline } from "react-icons/io5";


export default function QRCodeTypes() {
  const categories = [
    {
      name: "📱 Communication",
      items: [
        { icon: <IoGlobeOutline color="white"  className="" size={50} />, label: "Lien / URL" },
        { icon: <FaPhoneAlt color="white"  className="" size={50}/>, label: "Appel téléphonique" },
        { icon: <FaSms color="white"  className="" size={50}/>, label: "SMS" },
        { icon: <FaMailBulk color="white"  className="" size={50}/>, label: "Adresse e-mail" },
        { icon: <FaUserAlt color="white"  className="" size={50}/>, label: "Contact (vCard / MeCard)" },
        { icon: <FaShareAlt color="white"  className="" size={50} />, label: "Réseaux sociaux (générique)" },
        { icon: <FaInstagram color="white"  className="" size={50}/>, label: "Profil Instagram" },
        { icon: <FaFacebook color="white"  className="" size={50} />, label: "Profil Facebook" },
        { icon: <FaTwitter color="white"  className="" size={50}/>, label: "Profil Twitter" },
      ],
    },
    {
      name: "🌐 Internet & Médias",
      items: [
        
        { icon: <FaFileAlt color="white"  className="" size={50} />, label: "Texte brut" },
        { icon: <FaFilePdf color="white"  className="" size={50} />, label: "Document / PDF" },
        { icon: <FaImage color="white"  className="" size={50} />, label: "Image / Galerie" },
        { icon: <FaYoutube color="white"  className="" size={50} />, label: "Vidéo / YouTube" },
        { icon: <FaMusic color="white"  className="" size={50} />, label: "Audio / Podcast" },
        { icon: <FaWpforms color="white"  className="" size={50} />, label: "Formulaire en ligne" },
        { icon: <FaCloud color="white"  className="" size={50} />, label: "Lien cloud (Drive, Dropbox...)" },
      ],
    },
    {
      name: "💼 Entreprise & Événements",
      items: [
        { icon: <FaIdCard color="white"  className="" size={50} />, label: "Carte de visite numérique" },
        { icon: <FaCreditCard color="white"  className="" size={50} />, label: "Paiement / Bitcoin" },
        { icon: <FaReceipt color="white"  className="" size={50} />, label: "Facture / Reçu" },
        { icon: <FaCalendarAlt color="white"  className="" size={50} />, label: "Événement / Agenda" },
        { icon: <FaUtensils color="white"  className="" size={50}/>, label: "Menu de restaurant" },
        { icon: <FaTree color="white"  className="" size={50}/>, label: "Lien multi-plateformes (Bio / Linktree)" },
      ],
    },
    {
      name: "⚙ Technique & Utilitaire",
      items: [
        { icon: <FaWifi color="white"  className="" size={50} />, label: "Wi-Fi" },
        { icon: <FaMapMarkerAlt color="white"  className="" size={50} />, label: "Localisation (GPS)" },
        { icon: <FaSyncAlt color="white"  className="" size={50} />, label: "QR dynamique / Trackable" },
        { icon: <FaEdit color="white"  className="" size={50} />, label: "QR modifiable" },
        { icon: <FaLayerGroup color="white"  className="" size={50} />, label: "Page personnalisée (Landing)" },
        { icon: <FaNetworkWired color="white"  className="" size={50}/>, label: "Connexion réseau / Hotspot" },
        { icon: <FaLock color="white"  className="" size={50}/>, label: "Authentification / Connexion" },
        { icon: <AiOutlineAppstore color="white"  className="" size={50}/>, label: "Lien vers App Store / Play Store" },
      ],
    },
  ];

  return (
    <div className="flex  flex-col md:w-[80%] m-auto h-full bg-gray-300  justify-center p-6 gap-4">

      {
        categories.map((categorie, i) =>(
          categorie.items.map((item)=>(
            
            <div className="flex hover:bg-amber-50 gap-4 m-auto bg-white hover:border-amber-500 hover:border-2 w-1/2 p-2 items-center   rounded">
              <div className="bg-amber-600 p-2 rounded ">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold">{item.label}</h2>
                <p className="text-gray-500">Generer un Qr code pour tous type de lien internet</p>
              </div>
              <FaChevronRight color="gray" size={20} />
            </div>
          ))
        ))
      }

      



    
    </div>
  );
}