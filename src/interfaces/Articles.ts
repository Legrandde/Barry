
export interface Articles{
    id:number;
    titre:string;
    slug:string;
    content :string;
    excerpt:string;
    thumbnail:string;
    status:string
    langue:string;
    create_at:string;
    update_at:string;
    published_at:string;
    categorie:{nom:string}
    auteur:{
        nom :string
        photo :string
    }
}

export interface Categorie{
    id:number;
    nom:string;
    description:string;
}

