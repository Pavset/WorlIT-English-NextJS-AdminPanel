import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Link from 'next/link'

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
            { usersIn &&
                <div>
                    <h1>Учні у курсі</h1>
                    { usersIn.map((user, idx)=>{
                        return(
                            <div key={idx} >
                                <h2>{user.name}</h2>
                                <h2>{user.surname}</h2>
                                <h2>{user.yearsOld}</h2>
                                <Link href={`/users/${user.id}`}>
                                    повна інформація
                                </Link>
                            </div>
                        )
                    })}
                </div>
            }
            { usersNotIn &&
                <div>
                    <h1>Учні не у курсі</h1>
                    { usersNotIn.map((user, idx)=>{
                        return(
                            <div key={idx} >
                                <h2>{user.name}</h2>
                                <h2>{user.surname}</h2>
                                <h2>{user.yearsOld}</h2>
                                <Link href={`/users/${user.id}`}>
                                    повна інформація
                                </Link>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}