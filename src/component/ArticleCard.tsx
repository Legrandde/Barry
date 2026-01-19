import { Link } from "react-router-dom";



interface Articles{
    id:number;
    titre:string;
    content?:string;
    excerpt:string;
    thumbnail?:string;
    status?:string
    langue?:string;
    create_at?:string;
    update_at?:string;
    published_at?:string;
    categorie: {nom:string};
}


export default function ArticleCard({titre, thumbnail, excerpt, categorie, id}:Articles){
    return (
        <div className="flex flex-col w-full shadow-xl bg-white  md:w-96 rounded-2xl">
                <img src={`${thumbnail}`} alt="" className="h-42 object-cover rounded-2xl"/>
                <div className="p-4 gap-2 flex flex-col ">
                    <h2 className="p-1 bg-gray-100 w-30 shadow rounded text-gray-600">{categorie.nom}</h2>
                    <h2 className=" text-gray-500 font-bold text-xl">{titre}</h2>
                    <p className="font-light">{excerpt}</p>
                    <Link to={`article/${id}`} className="p-2 self-end bg-black text-white w-42 rounded cursor-pointer hover:bg-gray-800">En savoir plus</Link>
                </div>
        </div>
    )
}