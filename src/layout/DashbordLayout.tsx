import Card from "../component/Card";
import ProductCard from "../component/productCartd";
import TransationCard from "../component/TransactionCard";

export default function DashbordLayout(){

    return <div className="flex flex-col gap-4 p-4 items-center justify-center">

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
            <Card name="Nombre de produit en stock"  value={40} />
            <Card name="Produit en rupture de stock" value={3}/>
            <Card name="solde Actuel (Cash) " value={40000}/>
            <Card name="Chiffre d'affaire"  value={5000000}/>
        </div>

        <div className="flex  gap-10">
            {/* <h2>Alertes</h2> */}
            <div className="flex flex-col w-96  bg-white border-1 border-gray-200">
                <h2 className="pt-2 text-2xl font-bold text-center">Produits en rupture de stock</h2>
                <div className="flex gap-2 border-b-1 p-4 border-gray-200">
                    <span>Filter par </span>
                    <select name="" id="">
                        <option value="">Categorie 1</option>
                        <option value="">Categorie 2</option>
                        <option value="">Categorie 3</option>
                        <option value="">Categorie 4</option>
                    </select>
                </div>
                <div className="flex flex-col p-4">

                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />

                </div>
                
            </div>
        
            <div className="flex flex-col bg-white rounded mt-10">
                <h2 className="text-center text-2xl font-bold pt-2">Transactions</h2>
                
                <div className="flex p-4 gap-4 border-b-1 border-gray-300">
                    <div className="flex gap-4">
                        Type
                        <select name="" id="">
                            <option value="">Entrer d'argent</option>
                            <option value="">sortie d'argent</option>
                        </select>
                    </div>
                    <div className="flex gap-4">
                        Date
                        <select name="" id="">
                            <option value="">plus recent</option>
                            <option value="">Moins recents</option>
                        </select>
                    </div>


                </div>

                <div className="flex flex-col">
                    <TransationCard />
                    <TransationCard />
                    <TransationCard />
                    <TransationCard />
                </div>
                <button className="bg-amber-500 p-2 rounded cursor-pointer">Effectuer une Transation</button>
            </div>

        </div>

        <div className="flex">
            
        </div>

    </div>
}