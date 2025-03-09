import {toast} from "react-toastify";

export const handleSuccess=(mssg:string)=>{
    toast.success(mssg);
}

export const handleError=(mssg:string)=>{
    toast.error(mssg);
}