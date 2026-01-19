import axios from "axios";
import type { Articles } from "../interfaces/Articles";
import { useState, useEffect } from "react";
import SearchBar from "../component/SearchBar";
import ArticleCard from "../component/ArticleCard";



export default function Blog(){

    const [keyWord, setKeyWord] = useState<string>('')
    const [articles, setArticle]  = useState<Articles[]>()
    const [categorieshow, setCategorieShow] = useState<string>('')
     useEffect(()=>{
    const fetchArticle = async () =>{
      const response = await axios.get<Articles[]>("http://localhost:8000/ereukaarticles/");
      const data = await response.data
      setArticle(data)
    }
    fetchArticle()

  }, [])
    const articleFiltre = articles?.filter((art) =>{
      return art.titre.toLowerCase().includes(keyWord.toLowerCase()) && art.categorie.nom.includes(categorieshow)
    })

    return (
        <div className="w-full flex flex-col bg-whitte  items-center justify-center  p-4 ">
            <h1 className="p-4 text-2xl font-bold">Articles</h1>
            <SearchBar 
              keyWord={keyWord}   
              onchangeKeyword={setKeyWord}
              categorieShow={categorieshow}
              onCategorieShow={setCategorieShow} 
              />
            <div className={`flex flex-col md:grid    p-4 w-[80%]  items-center justify-center sm:grid-cols-3 gap-4`}>
              {
                articleFiltre?.length > 0  ?(
                    articleFiltre?.map(article=>(
                    <ArticleCard   
                      titre={article.titre}  
                      thumbnail={article.thumbnail} 
                      categorie={article.categorie}  
                      excerpt={article.excerpt}   
                      key={article.id} id={article.id} 
                      
                      />
                ))
                ):
                <p className="text-center bg-amber-400 p-3  w-full">Aucun element</p>
                
              }
              
                
            </div>
            
            
        </div>
    )
}

