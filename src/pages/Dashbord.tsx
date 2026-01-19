import { useState } from "react"
import Header from "../component/Heeader"
import SideBar from "../component/SideBard"
import DashbordLayout from "../layout/DashbordLayout"

function Dashbord(){

   

    const [displayAllS, setDisplayAll] = useState<boolean>(true)
     const handleClick = ()=>{
        setDisplayAll(!displayAllS)
        console.log(displayAllS)
    }
    return (
        <div className="flex w-full  bg-gray-100">
            <SideBar displayAll={displayAllS}  />
            <div className="flex flex-col w-full">
                <Header onChangeDisplay={handleClick}/>
                <DashbordLayout />
            </div>
        </div>
    )
}

export default Dashbord