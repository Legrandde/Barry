import { AiOutlineProduct } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";

export default function ProductCard(){

    return(
        <div className="flex items-center jbe gap-4 hover:bg-gray-100 w-full  p-2 rounded">
            <AiOutlineProduct size={25} className="bg-amber-500 h-10 w-10 rounded"/>
            <div className="flex flex-col w-full">
                <span className="text-gray-500">Nom: Telephone</span>
                <span className="text-gray-500">Quantité: <span className="font-bold text-red-600">10</span> </span>
                <span className="bg-gray-100 w-20">Fruit</span>
            </div>
            
            <button  className="cursor-pointer end"><BiEditAlt /></button>

        </div>
    )
}