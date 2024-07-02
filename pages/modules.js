import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import styles from "@/app/globals.css";
import Link from 'next/link'

export default function Modules() {
    const apiUrl = 'http://localhost:8000'
    const [modules, setModules] = useState()   
    const [cookies, setCookie] = useCookies(['token'])
    const [error, setError] = useState([])
    const [load, setLoading] = useState([])
    const value = cookies.token
    const router = useRouter()


    function getmodules() {
        fetch(`${apiUrl}/modules`,{
            method: "GET",
            headers: {
                "token": `${value}`,
            }
        })
        .then((response) => response.json())
        .then(
          async (data) => {
            setModules(await data.allModules)
            console.log(data)
          }
        );
    }
    useEffect(()=>{getmodules()},[])

  
  return( 
    <div>
        <div class="flex w-full bg-orange-600 h-30 justify-around">
            <p class="font-medium text-xl text-white">Вчителі</p>
            <Link class="font-normal text-xl text-white underline hover:no-underline" href={`/courses`}>Курси</Link>
            <Link class="font-normal text-xl text-white underline hover:no-underline" href={`/staff`}>Вчителя</Link>
            <Link class="font-normal text-xl text-white underline hover:no-underline" href={`/users`}>Учені</Link>
            <Link class="font-normal text-xl text-white underline hover:no-underline" href={`/modules`}>Модулі</Link>
            <Link class="font-normal text-xl text-white underline hover:no-underline" href={`/worldLists`}>Список слів</Link>
        </div>
        { modules &&
            <div>
                {modules.map((module, idx)=>{
                    return(
                        <button key={idx} onClick={()=>{
                            router.push(`modules/${module.id}`)
                        }}>
                            {module.name}
                            
                        </button>
                    )
                })
                }
            </div>
        }
    </div>
  )
}
