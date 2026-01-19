import type { ReactElement } from "react"
import { useTheme } from "../contexts/ThemeContext"

interface InputInterfaceProps{
    type:string,
    label?:string,
    name?:string,
    placeholder:string,
    value?:string,
    icons?: ReactElement;
    onChangeValue?:(e:string)=> void
}


export default function Input({type, icons, label, name, placeholder, value, onChangeValue}:InputInterfaceProps){
    const { theme } = useTheme();

    return (
        <div className="flex flex-col">
        {
            label ? (
                <label className={`w-full mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`} htmlFor={name}>
                    {label}
                </label>
            ) : ""
        }
        <div className={`flex items-center gap-2 p-2 rounded border ${
            theme === 'dark' 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-gray-100 border-gray-300'
        }`}>
            {icons && <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {icons}
            </span>}
            <input 
            type={type} 
            name={name}
            value={value || ''} 
            id={name}
            onChange={(e)=> onChangeValue && onChangeValue(e.target.value)}
            className={`outline-none w-full rounded ${
                theme === 'dark' 
                    ? 'bg-gray-700 text-white placeholder-gray-400' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
            }`}
            placeholder={placeholder}/>
        </div>
        </div>
        
    )
}