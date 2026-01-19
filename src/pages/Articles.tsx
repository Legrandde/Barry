import { useEffect, useState } from "react";

import {  useNavigate, useParams } from "react-router-dom";
import type { Articles } from "../interfaces/Articles";
import axios from "axios";
import { FiChevronRight } from "react-icons/fi";

function smartDateFormater(isoDate:any){
  const date = new Date(isoDate)
  const realtimeDate = new  Date()

  const diff = realtimeDate.getTime() - date.getTime()
  const oneDay = 24*60*60*1000
  if(diff < oneDay && date.getDate() === realtimeDate.getDate()){
    return "Aujourd'hui"
  }
  if(diff < 2 * oneDay && date.getDate() === realtimeDate.getDate()- 1){
    return "Hier"
  }
  return date.toLocaleDateString("fr-FR",{
    day:"2-digit",
    month:"long",
    year:"numeric"
  })
  
}

export default function Article(){

    const {id} = useParams()
    const navigate = useNavigate()
    const [article, setArticle]  = useState<Articles>()

    useEffect(()=>{
        const fetchArticle =  async () =>{
            const response = await axios.get<Articles>(`http://localhost:8000/ereukaarticles/${id}`)
            setArticle(response.data)
        }

        fetchArticle()

    }, [])

    return(
        <div className="flex flex-col w-full items-center justify-center gap-6">
            <button onClick={()=> navigate(-1)} className="flex cursor-pointer items-center gap-2">Blog <FiChevronRight /></button>
                <div className="p-4  gap-6 flex flex-col justify-center w-[70%]">
            
                    <h2 className=" text-gray-500 font-bold text-4xl"> {article?.titre}</h2>
                    <div className="flex items-center  gap-4">
                        <img 
                        src={article?.auteur.photo} 
                        alt=""
                        className="w-10 h-10 bg-slate-500 rounded-full"
                        />
                        <h2 className="text-xl font-bold text-gray-600">Par {article?.auteur.nom} le {smartDateFormater(article?.create_at)}</h2>
                    </div>
                    <img src={`${article?.thumbnail}`} alt="" className="w-full h-80 object-cover rounded-2xl"/>
                    <p className="font-light text-justify">
                        {article?.content}
                    </p>
                </div>
        </div>
    )
}