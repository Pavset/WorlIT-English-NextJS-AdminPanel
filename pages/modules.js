import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

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
