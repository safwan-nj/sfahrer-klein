import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react'
import { ButtonPrimary, InputPrimary } from '../../Components/index';
import icon from '../../assets/icon.png'
import './Splash.css'


const Splash = () => {
    const fahrer_name_ref=useRef();
    const fahrer_pass_ref=useRef();
    const [items, setItems] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setItems('KLASC134')
    }, []);

    const setLocalStorageIems=()=>{
        const localItems = localStorage.getItem('device_id');
        if (localItems){ 
            alert(`Welcome:\n${localItems}`);
        }else{
            localStorage.setItem('device_id', JSON.stringify(items));
            alert (`The device_id set to:\n'[${items}]'`);
        }
    }

    const onBtnPressNavigateTo=(page)=>{
        navigate("/scan");
        setLocalStorageIems();
    }
    return (
        <div className="login sa-bg-main-dark mt-12">
            <div className="w-full sa-bg-main-dark-transparent p-3 rounded-lg">
                <div className="flex flex-col items-center py-7">

                <a 
                    className="fixed left-1/2 transform -translate-x-1/2 mt-4 text-white text-sm font-roboto font-medium"
                    href="https://safwan-nj.github.io"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src={icon}
                        className="h-24 w-24 rounded-full mb-1 border-none sa-bg-shadow-white-glow"
                        alt="appIcon"
                    />
                </a>
                    <p className="text-xl font-bold text-indigo-200 pt-7 pb-2 mt-28">S-Fahrer Splash</p>
                </div>
                <div className="flex-col space-y-5 w-full items-center mb-9 pb-9 px-8 sa-bg-shadow-white-glow rounded-md pt-9">
                    <InputPrimary
                        innerRef={fahrer_name_ref}
                        className=""
                        maxLength={13}
                        placeholder="Fahrer-Name"
                        type="text"
                        readOnly  // إضافة هذا السطر لجعل العنصر غير قابل للكتابة

                    />
                    <InputPrimary
                        innerRef={fahrer_pass_ref}
                        className=""
                        maxLength={13}
                        placeholder="Fahrer-Password"
                        type="password"
                        readOnly  // إضافة هذا السطر لجعل العنصر غير قابل للكتابة

                    />
                    <ButtonPrimary
                        title="Splash"
                        onPress={onBtnPressNavigateTo}
                    />
                    <div className="mb-8"></div>
                </div>
            </div>
        </div>




    )
}

export default Splash