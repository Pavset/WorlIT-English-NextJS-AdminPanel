import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Link from 'next/link'
import styles from "@/app/globals.css";

export default function Users(){
    // const apiUrl = 'https://worlit-english-app-api.onrender.com'
    const apiUrl = 'http://localhost:8000'
    const [usersIn, setUsersIn] = useState()
    const [usersNotIn, setUsersNotIn] = useState()
    const [cookies, setCookie] = useCookies(['token'])
    const [error, setError] = useState([])
    const [load, setLoading] = useState([])
    const value = cookies.token


    const router = useRouter()
    console.log(value)
    async function getUsers(){
        fetch(`${apiUrl}/users`,{
            method: "GET",
            headers: {
                "token": `${value}`,
            }
        })
        .then(res => res.json())
        .then(async data => {
            
            if (!data.error){
                console.log(data)
                setUsersIn(data.usersIn)
                setUsersNotIn(data.usersNotIn)
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
    
    function goToUserPage(id){
        console.log(id)
    };
    useEffect(()=>{getUsers()},[])
    return(
        <div>
        <div class = "flex w-full bg-orange-600 h-30 justify-around">
            <p class = "font-medium text-xl text-white">Учені</p>
            <Link class = "font-normal text-xl text-white underline hover:no-underline" href={`/courses`}>Курси</Link>
            <Link class = "font-normal text-xl text-white underline hover:no-underline" href={`/staff`}>Вчителя</Link>
            <Link class="font-normal text-xl text-white underline hover:no-underline" href={`/users`}>Учені</Link>
            <Link class = "font-normal text-xl text-white underline hover:no-underline" href={`/modules`}>Модулі</Link>
            <Link class = "font-normal text-xl text-white underline hover:no-underline" href={`//worldLists`}>Список слів</Link>
        </div>
        <div class = "flex flex-column justify-around">
            { usersIn &&
                <div class = "">
                    <p class = "font-bold text-lg">Учні у курсі</p>
                    <div class="columns-4 border-b-2 border-gray-200 py-4" >
                        <p class = "font-normal">Ім'я</p>
                        <p class = "font-normal">Фамілія</p>
                        <p class = "font-normal">Вік</p>
                    </div>
                    { usersIn.map((user, idx)=>{
                        return(
                            <div class="columns-4 border-b-2 border-gray-200 py-4" key={idx} >
                                <p class = "font-normal">{user.name}</p>
                                <p class = "font-normal">{user.surname}</p>
                                <p class = "font-normal">{user.yearsOld}</p>
                                <Link class="text-sky-600 hover:text-sky-300" href={`/users/${user.id}`}>
                                    повна інформація
                                </Link>
                            </div>
                        )
                    })}
                </div>
            }
            { usersNotIn &&
                <div class = "">
                    <p class = "font-bold text-lg">Учні не у курсі</p>
                    <div class="columns-4 border-b-2 border-gray-200 py-4">
                        <p class = "font-normal">Ім'я</p>
                        <p class = "font-normal">Фамілія</p>
                        <p class = "font-normal">Вік</p>
                    </div>
                    { usersNotIn.map((user, idx)=>{
                        return(
                            <div class="columns-4 border-b-2 border-gray-200 py-4" key={idx} >
                                <p class = "font-normal">{user.name}</p>
                                <p class = "font-normal">{user.surname}</p>
                                <p class = "font-normal">{user.yearsOld}</p>
                                <Link class="text-sky-600 hover:text-sky-300" href={`/users/${user.id}`}>
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