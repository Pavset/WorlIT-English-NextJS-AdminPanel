import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Link from 'next/link'
import styles from "@/app/globals.css";

export default function Staff(){

    const apiUrl = 'http://localhost:8000'
    const [cookies, setCookie] = useCookies(['token'])
    const [staff, setStaff] = useState([])
    const [name, setName] = useState()
    const [surname, setSurname] = useState()
    const [image, setImage] = useState()
    const [phone, setPhone] = useState()
    const [tg, setTg] = useState()
    const [viber, setViber] = useState()

    const router = useRouter()
    const value = cookies.token

    function createStaff(){
        console.log(name)
        console.log(surname)
        console.log(phone)
        console.log(image)
        
        fetch(`${apiUrl}/staff`,{
            method: "POST",
            headers: {
                "token": `${value}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify(data)
            body:JSON.stringify({
                name: name,
                surname: surname,
                phone: phone,
                imagePath: image,
                tg: tg,
                viber: viber
            })
        })
        .then((response) => response.json())
        .then(
          async (data) => {
            if(!data.error){
              console.log(data.staff)
          } else{
              console.error(data.error)
          }
          }
        );
    }

    function getStaff() {
        fetch(`${apiUrl}/staff`,{
            method: "GET",
            headers: {
                "token": `${value}`,
            }
        })
        .then((response) => response.json())
        .then(
          async (data) => {
            if(!data.error){
              setStaff(await data.staff)
              console.log(data.staff)
          } else{
              console.error(data.error)
          }
          }
        );
      }
    useEffect(()=>{getStaff()},[])
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
        {staff && (
            <div>
                <p class = "font-large text-xl ">Створення вчителя</p>
                <div class="flex flex-row bg-slate-300 py-8 gap-3">
                    <div class="flex flex-col ml-5">
                        <p>name</p>
                        <input type="text" value={name} onChange={(event) => {
                            setName(event.target.value)
                        }} />
                    </div>
                    
                    <div class="flex flex-col">
                        <p>surname</p>
                        <input type="text" value={surname} onChange={(event) => {
                            setSurname(event.target.value)
                        }} />
                    </div>

                    <div class="flex flex-col">
                        <p>phone</p>
                        <input type="text" value={phone} onChange={(event) => {
                            setPhone(event.target.value)
                        }} />
                    </div>

                    <div class="flex flex-col">
                        <p>tg</p>
                        <input type="text" value={tg} onChange={(event) => {
                            setTg(event.target.value)
                        }} />
                    </div>

                    <div class="flex flex-col">
                        <p>viber</p>
                        <input type="text" value={viber} onChange={(event) => {
                            setViber(event.target.value)
                        }} />
                    </div>

                    <div class="flex flex-col">
                        <p>imageURL</p>
                        <input type="text" value={image} onChange={(event) => {
                            setImage(event.target.value)
                        }} />
                    </div>
                    <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => { createStaff() }}>
                        Створити
                    </button>
                </div>
                <div class = "mx-10">
                <div class="columns-4 border-b-2 border-gray-200 py-4">
                    <p class="font-normal">Ім'я</p>
                    <p class="font-normal">Фамілія</p>
                    <p class="font-normal">ID</p>
                </div>
                {staff.map((s, idx) => {
                    return (
                        <div class="columns-4 border-b-2 border-gray-200 py-4" key={idx} >
                            <p class="font-normal">{s.id}</p>
                            <p class="font-normal">{s.name}</p>
                            <p class="font-normal">{s.surname}</p>
                            <Link class="text-sky-600 hover:text-sky-300" href={`/staff/${s.id}`}>
                                повна інформація
                            </Link>
                        </div>
                    )
                })}
                </div>
            </div>
        )}
    </div>
)}