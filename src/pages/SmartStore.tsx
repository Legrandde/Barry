import {  FaLock, FaUser } from "react-icons/fa";
import Input from "../component/Input";
import { BsGoogle } from "react-icons/bs";
import { useState } from "react";
import axios from "axios";




export default function SmartStore(){

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [erreur, setEror] = useState<string>("")

    const handleSubmit = async (e:React.FormEvent)=>{
    e.preventDefault()
    try{
        const response = await axios.post(
            "http://localhost:8000/smartStore/api/token/",
            {
                username,
                password
            }
        );
        localStorage.setItem('access_token', response.data.access)
        localStorage.setItem('refresh_token', response.data.refresh)
        
        
        window.location.href = "smartStore/dashbord"
    }
    catch (err: any){
        setEror(err)

    }
}


    return <div className="bg-gray-200 h-screen flex items-center justify-center">
    
    <div className="flex flex-col border-1 border-gray-300 p-4 bg-white shadow w-96 rounded-xl ">
        <span className="text-center">Smart<span 
        className=" text-amber-400 font-bold">Store</span></span>
        <h2 className="text-3xl p-2 text-center ">Connexion</h2>
        <form  onSubmit={handleSubmit} action="" className="flex flex-col gap-2">
            <Input 
                label="Email ou nom d'utilisateur" 
                icons={<FaUser />} 
                placeholder="Nom d'utilisateur"
                name="username"
                value={username}
                type="text"
                onChangeValue={setUsername}

                  />
            <Input 
                type="password"     
                label="Email" 
                icons={<FaLock />} 
                placeholder="Entrer le mots de pass"
                name="password"
                value={password}
                onChangeValue={setPassword}
                
                />
            <button className="bg-amber-400 border-1 border-gray-300 p-2 rounded cursor-pointer hover:bg-amber-300">Connexion</button>
            <p className={`text-center text-red-600 'hidden'}`}>{erreur}!</p>
            <span className="text-center">Or</span>
             <button className="flex cursor-pointer items-center rounded hover:bg-blue-200 p-2 gap-2 justify-center self-center border-1 w-full border-gray-300"><BsGoogle />Continuer avec google</button>
        </form>
    </div>
    </div>
}