"use client"

import Image from "next/image";
import styles from "../app/page.module.css";
import '../app/globals.css'
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { useCookies } from "react-cookie";
// import styles from "@/app/page.module.css";


const apiUrl = 'https://worlit-english-app-api.onrender.com'//process.env.URL

export default function Login(){
    const router = useRouter()
    const [cookies, setCookie] = useCookies(['token'])
    const [formData, changeData] = useState({
        name: "",
        password: ""
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    
    function formInput(event){
        const name = event.target.name
        const value = event.target.value
        changeData(previous =>({
            ...previous,
            [name]: value
        })) 
    }

    function sendForm(event){
        setLoading(true)
        setError("")
        console.log(formData)
        event.preventDefault()
        fetch(`${apiUrl}/signin`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(formData)
        })
        .then(res => {return res.json()})
        .then(data => {
            
            if (!data.error){
                setLoading(false)
                
                router.push("/")
                setCookie('token', data.apikey)
            } else {
                setLoading(false)
                setError(data.error)
            }
        })
    }

    return(
        <main class="bg-gray-100 flex justify-center items-center h-screen"  style={{"background-color": "#313131"}}>

{loading &&
  <div class="absolute bg-white bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
  <div class="flex items-center">
    <div class='flex space-x-2 justify-center items-center h-screen '>

  	<div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
	<div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
	<div class='h-8 w-8 bg-black rounded-full animate-bounce'></div>
</div>
  </div>
</div>
}


        <div class="w-1/2 h-screen hidden lg:block">
          <img src="https://i.ibb.co/wYKT8kM/Frame-16.png" alt="Placeholder Image" class="object-cover w-full h-full"/>
        </div>
            
        <div class="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2 gap-2">

          <h1 class="text-2xl font-semibold mb-4">Login</h1>
          <form action="#" method="POST">
            
            <div class="mb-4">
              <label for="name" class="block text-white" >Username</label>
              <input type="text" id="name" name="name" value={formData.username} required onChange={formInput} class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autocomplete="off"/>
            </div>
            
            <div class="mb-4">
              <label for="password" class="block text-white" >Password</label>
              <input type="password" id="password" name="password" value={formData.password} required onChange={formInput} class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autocomplete="off"/>
            </div>
            
            {error &&
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span class="block font-bold sm:inline">{error}</span>
              </div>
            }

            <button type="submit" onClick={(event)=>{sendForm(event)}} class="bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-600 text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
          </form>
            
        </div>
</main>

    );
}