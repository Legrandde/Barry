import { FaEnvelope, FaObjectGroup } from "react-icons/fa";
import Input from "./Input";
import { BiPhone } from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";
import { useTheme } from "../contexts/ThemeContext";

export default function Contact(){
    const { theme } = useTheme();

    return( 
        <div className={`flex p-4 w-full gap-4 flex-col justify-centenr items-center ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-transparent'
        }`} id="contact">
            <div className="text-center mb-12">
                <span className="text-sm font-semibold text-amber-500 uppercase tracking-wide">Contact</span>
                <h2 className={`text-4xl md:text-5xl font-bold mt-2 mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                    Travaillons ensemble
                </h2>
                <p className={`text-lg max-w-2xl mx-auto ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                    Discutons de votre projet et créons quelque chose d'extraordinaire
                </p>
            </div>

            <div className={`flex p-6 justify-center m-auto w-full md:w-[80%] flex-col md:flex-row rounded transition-all ${
                theme === 'dark' ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white border border-gray-200'
            }`}>

                <div className="flex p-4 flex-col gap-4">

                    <div className={`flex self-start gap-6 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        <BiPhone className="text-amber-500" size={25} />
                        <span>00224 626 01 45 52</span>
                    </div>
                    <div className={`flex self-start gap-6 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        <FaEnvelope className="text-amber-500" size={25} />
                        <span>barryalhassane476@gmail.com</span>
                    </div>
                    <div className={`flex self-start gap-6 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        <CiLocationOn className="text-amber-500" size={25} />
                        <span>Timbi Madina</span>
                    </div>
                    
                </div>
            
                <form action="" className="md:w-[50%] p-4 flex gap-4 flex-col">
                    <Input 
                        icons={<FaEnvelope />}
                        type="email"
                        name="email"
                        value=""
                        placeholder="E-mail"
                        onChangeValue={() => {}}
                    />
                    <Input
                        icons={<FaObjectGroup />}
                        type="text"
                        name="object"
                        value=""
                        placeholder="Object"
                        onChangeValue={() => {}}
                    />
                    <textarea 
                        name="" 
                        id="" 
                        className={`h-40 p-2 rounded outline-none resize-none ${
                            theme === 'dark' 
                                ? 'bg-gray-700 text-white placeholder-gray-400 border border-gray-600' 
                                : 'bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300'
                        }`}
                        placeholder="Message..."
                    />
                    <button 
                        type="submit"
                        className="p-3 bg-amber-400 hover:bg-amber-500 text-white font-semibold rounded transition-colors"
                    >
                        Envoyer le message
                    </button>
                </form>

            </div>
            
        </div>
    )
}