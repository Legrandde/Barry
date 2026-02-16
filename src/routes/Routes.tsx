import {  createBrowserRouter } from "react-router-dom";
import Article from "../pages/Articles";
import InternetLink from "../component/forms/InternetLink";
import SmartStore from "../pages/SmartStore";
import Dashbord from "../pages/Dashbord";
import Portfolio from "../pages/Portfofio";
import DetailProject from "../component/DetailProject";

export const Router = createBrowserRouter(
    [
        {
            path:"",
            element: <Portfolio />
        },
    
        {
            path:'Blog/article/:id',
            element: <Article />
        },
        {
            path:"internet-link",
            element: <InternetLink />
        },
        {
            path: "smartStore",
            element: <SmartStore />
        },
        {
            path: "smartStore/dashbord",
            element: <Dashbord />
        },
        {
            path: "detaille",
            element: <DetailProject />
        }
            
    

    ]
)