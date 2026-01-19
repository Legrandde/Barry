import { IoGlobeOutline } from "react-icons/io5";
import Input from "../Input";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

export default function InternetLink(){
    const [link, setLink] = useState<string>("")
    const [nom, setNom] = useState<string>("")

    return(
        <div className="flex flex-col gap-2 m-auto w-96 shadow rounded ">
            <div className="flex items-center gap-4 bg-gray-200 p-4">
                <IoGlobeOutline size={50}  className=""/>
                <div className="flex flex-col">
                    <h2>Lien internet </h2>
                    <p className="text-gray-500 ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, quibusdam.</p>
                </div>
            </div>
            <form action="" className="flex flex-col p-4 gap-2">

                <Input 
                    
                    type="text" 
                    name="url" 
                    placeholder="Entrer l'url ou le lien" 
                    value={link}
                    onChangeValue={setLink}
                />
                <Input
                    value={nom}
                    onChangeValue={setNom}
                    label="Nom du Qr code"
                    type="text"
                    name="nom"
                    placeholder="Entrer le nom du QR code"

                />
                <button defaultChecked={false} className="text  flex items-center gap-4 hover:bg-amber-400 justify-center -black bg-amber-600 w-35 self-end rounded  p-2">Continuer <FaArrowRight  className="font-medium" /></button>
            </form>
        </div>
    )
}