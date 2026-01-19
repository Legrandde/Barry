import { FaSearch, FaUserAlt } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import Input from "./Input";
import { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
interface HeaderProps{
    onChangeDisplay:()=> void
}

export default function Header({onChangeDisplay}:HeaderProps){

    const [search, setSearch]=  useState("")

    return(
        <header className="flex  gap-6 bg-white shadow-xl p-4 w-full justify-around items-center">
            <CiMenuBurger className="cursor-pointer"  onClick={onChangeDisplay}/>
            <span 
                className="text-2xl">
                    tableau de bord
            </span>

            <Input 
                icons={<FaSearch />}
                type="search" 
                value={search}
                name="search" 
                placeholder="Rechercher..."
                onChangeValue={setSearch}
                />

            <div className="flex items-center justify-between gap-10">
                <span>Nom d'utilisateur</span>
                <FaUserAlt size={25}  className="bg-gray-400 p-2 h-10 w-10 rounded-full"/>
                <MdLogout title="Deconnexion"  size={25} className="cursor-pointer"/>
            </div>

        </header>
    )
}