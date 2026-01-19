import { useEffect, useState } from "react";
import type { Categorie } from "../interfaces/Articles";
import axios from "axios";




interface SearchBar{
    keyWord:string;
    categorieShow:string;
    onCategorieShow: (categorieInputValue:string) => void
    onchangeKeyword:(inputvalue:string) => void;
}

export default function SearchBar({keyWord, onchangeKeyword, onCategorieShow}:SearchBar){

    const [categorie, setCategorie] = useState<Categorie[]>()

     useEffect(()=>{
    const fetchCategories = async () =>{
      const response = await axios.get<Categorie[]>("http://localhost:8000/ereukacategorie/");
      const data = await response.data
      setCategorie(data)
    }
    fetchCategories()

  }, [])

  

    return(
        <div className="flex">
            <div className="flex md:flex-row fixe flex-col p-2 gap-8">
                <input
                value={keyWord}
                onChange={(e) =>onchangeKeyword(e.target.value)}
                type="search"
                placeholder="Chercher un article"
                className="bg-gray-100 p-2 shadow w-96"
                />
                <select name="" id="" className="p-2 shadow bg-gray-100"
                onChange={(e)=> onCategorieShow(e.target.value)}
                >
                    {categorie?.map(categ =>(
                        <option key={categ.id} value={categ.nom}>{categ.nom}</option>
                    ))}
                    <option value="">Tout</option>
                </select>
            </div>
        </div>
    )
}