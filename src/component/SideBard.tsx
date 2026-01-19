import { Link } from "react-router-dom"




interface SideBarProps{
    displayAll:boolean
    onChangeDisplay?:()=> void
}


export default function SideBar({displayAll}:SideBarProps){

    return (
        <div className={`flex flex-col ${displayAll? "w-64" : "w-20 flex-col"} transform ease-in-out  p-4 bg-white border-1 border-gray-200 h-screen`}>
            <span 
                className={`${displayAll? "text-2xl" : ""}  flex gap-2 justify-center`}>Smart<span className="text-amber-500 font-bold">Store</span>
            </span>
            <Link to="./">Dasbord </Link>


        </div>
    )
}