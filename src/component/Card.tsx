import { FaArrowUp } from "react-icons/fa";
import { FaProductHunt } from "react-icons/fa6";

interface CardProps{
    name: string,
    value:number,
}


export default function Card({name, value}: CardProps){

    return <div className="flex flex-col w-76 border-1 border-gray-300 bg-white  rounded shadow">
        <div className="flex p-4 items-center gap-2 border-gray-300 border-b-1 w-full">
            <h2 className="text-gray-500 text-center">{name}</h2>
            <FaProductHunt />
        </div>
        <div className="flex p-4 flex-col">
            <h2 className="text-4xl font-bold text-center">{value}</h2>
            <span className="flex p-2 w-full justify-center gap-2 items-center">
                {value>20? "Evolution": "Regression"}<span className="flex items-center text-green-500 font-bold">20% <FaArrowUp /></span> </span>
        </div>
    </div>
}