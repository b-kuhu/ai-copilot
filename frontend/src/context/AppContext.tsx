"use client"

import { createContext, useContext, useEffect, useState } from "react";
import api from "../apiInterceptor";
import { toast } from "react-toastify";

interface AppContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isAuth: boolean;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  fetchUser: () => Promise<void>;
  logoutUser: () => Promise<void>
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    async function fetchUser() {
        setLoading(true);
        try {
            const { data } = await api.get(`/api/v1/me`)
            setUser(data);
            setIsAuth(true);
        }
        catch(error) {
            console.log(error);
            setUser(null);
            setIsAuth(false);
        }
        finally {      
            setLoading(false);
        }
    }

    async function logoutUser(){
        try {
            const { data } = await api.post('/api/v1/logout')
            toast.success(data?.message)
            setIsAuth(false)
            setUser(null)
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    useEffect(() => {
        fetchUser();
    },[])

    return (<AppContext.Provider value={{user, setUser, loading, setLoading, isAuth, setIsAuth, fetchUser, logoutUser }}>
        {children}
    </AppContext.Provider>)

}

export const AppData = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppData must be used within an AppProvider");
    }
    return context;
}
