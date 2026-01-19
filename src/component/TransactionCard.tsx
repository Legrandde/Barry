import { AiOutlineProduct } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { BsCashCoin } from "react-icons/bs";

export default function TransationCard(){

    // type 
    // montant 
    // date

    return(
        <div className="flex items-center jbe gap-4 hover:bg-gray-100 w-full  p-2 rounded">
            <AiOutlineProduct size={25} className="bg-amber-500 h-10 w-10 rounded"/>
            <div className="flex flex-col w-full">
                <span className="text-gray-500">Type de transaction</span>
                <span className="text-gray-500">Montant: <span className="font-bold text-red-600">10000</span> </span>
                <span className="bg-gray-100 ">Date: 13/1/2025</span>
            </div>
            
            <button  className="cursor-pointer end"><BiEditAlt /></button>

        </div>
    )
}