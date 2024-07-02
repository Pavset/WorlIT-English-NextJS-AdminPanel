import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Link from 'next/link'
import styles from "@/app/globals.css";

export default function wordLists(){
    // const apiUrl = 'https://worlit-english-app-api.onrender.com'
    const apiUrl = 'http://localhost:8000'
    const [wordLists ,setWordLists] = useState()
    const [createName ,setCreateName] = useState()
    const [createdId ,setCreatedId] = useState()



    const [cookies, setCookie] = useCookies(['token'])
    const [error, setError] = useState([])
    const [load, setLoading] = useState([])
    const value = cookies.token


    const router = useRouter()
    async function getWordLists(){
        fetch(`${apiUrl}/wordList`,{
            method: "GET",
            headers: {
                "token": `${value}`,
            }
        })
        .then(res => res.json())
        .then(async data => {
            
            if (!data.error){
                console.log(data)
                setWordLists(await data.wordLists)
            } else {
                setLoading(false)
                setError(await data.error)
                console.log(await data.error)
            }
        })
        .catch(async (err)=>{
            console.log(err)
        })
    }

  function createWordList(){
    fetch(`${apiUrl}/wordList`, {
      method: "POST",
      headers: {
        "token": `${value}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({   
        name: createName,
    })
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        if(!data.error){
            console.log(await data.wordLists)
            setCreatedId(await data.wordLists)
            router.push(`/wordLists/${await createdId.id}`)
        } else{
            console.error(data.error)
        }
      }
    );
  }


    useEffect(()=>{getWordLists()},[])
    return(
        <div>

            <div class = "w-full h-16 bg-orange-600">
                <p class = "font-normal text-white-500">Списки слів</p>
            </div>

            <div>
                <p class = "font-normal text-white-500">Створити список слів</p>
                <input value={createName} onChange={(e)=>{setCreateName(e.target.value)}} placeholder='Введіть назву нового списку слів'/>
                <button onClick={()=>{
                    createWordList()
                }}>Створити</button>
            </div>

            <div class = "flex flex-column justify-around">
                { wordLists &&
                    <div class = "">
                        <p class = "font-bold text-lg">Списки слів</p>
                        <div class="columns-2 border-b-2 border-gray-200 py-4">
                            <p class = "font-normal">Ім'я</p>
                        </div>
                        { wordLists.map((wList, idx)=>{
                            return(
                                <div class="columns-2 border-b-2 border-gray-200 py-4" key={idx} >
                                    <p class = "font-normal">{wList.name}</p>
                                    <Link class="text-sky-600 hover:text-sky-300" href={`/wordLists/${wList.id}`}>
                                        повна інформація
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                }
            </div>

        </div>
    )
}