import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth, googleProvider } from '../../utils/firebase'
import api from '../../utils/axios'
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { setUserdata } from '../redux/userSlice';
import SideBar from '../components/SideBar';
import ChatArea from '../components/ChatArea';
import Artifact from '../components/Artifact';

function Home() {
    const {userData}=useSelector(state=>state.user)
    const dispatch=useDispatch()
    const handleLogin = async (token) => {
        try {
            const { data } = await api.post("/api/auth/login", { token })
            dispatch(setUserdata(data))
        } catch (error) {
            console.log(error)
        }
    }


    const handleDevLogin = async () => {
        try {
            const { data } = await api.post("/api/auth/dev-login")
            dispatch(setUserdata(data))
        } catch (error) {
            console.log(error)
        }
    }

    const googleLogin = async () => {
        try {
            const data = await signInWithPopup(auth, googleProvider)
            const token = await data.user.getIdToken()
            await handleLogin(token)
        } catch (err) {
            console.error("Firebase Login Error:", err)
        }
    }
    return (
        <div className='h-screen  flex bg-[#0d0f14] text-white overflow-hidden'>

<SideBar/>
<ChatArea/>
<Artifact/>




{!userData &&   <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur'>
                <div className='w-[340px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-4'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-[17px] font-semibold text-slate-100 tracking-tight'>Welcome to CortexAI</h2>
                        <p className='text-[13px] text-slate-500'>Sign in with Google or continue in Dev Mode.</p>
                    </div>

                    <button className='w-full flex items-center justify-center gap-3 py-[11px] rounded-xl text-sm font-medium text-black/90 bg-white hover:bg-gray-200 transition-all duration-150 cursor-pointer shadow-sm' onClick={googleLogin}>
                        <FcGoogle size={18} />
                        Continue With Google
                    </button>

                    <div className='flex items-center gap-2 my-1'>
                        <div className='h-[1px] bg-white/10 flex-1' />
                        <span className='text-[11px] text-slate-500 uppercase tracking-wider'>or</span>
                        <div className='h-[1px] bg-white/10 flex-1' />
                    </div>

                    <button className='w-full flex items-center justify-center gap-2 py-[10px] rounded-xl text-sm font-medium text-slate-300 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] transition-all duration-150 cursor-pointer' onClick={handleDevLogin}>
                        ⚡ Continue as Guest (Dev Mode)
                    </button>
                </div>
            </div>}
          
        </div>
    )
}

export default Home
