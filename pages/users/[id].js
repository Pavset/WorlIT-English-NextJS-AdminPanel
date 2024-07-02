import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Link from 'next/link';
import styles from "@/app/globals.css";

export default function GetProduct() {
    const apiUrl = 'http://localhost:8000'
    const [user, setUser] = useState()
    const [courses, setCourses] = useState()
    const [userChoice, setUserChoice] = useState()

    const [cookies, setCookie] = useCookies(['token'])
    const [error, setError] = useState([])
    const [load, setLoading] = useState([])
    const value = cookies.token
    
    const router = useRouter()
    const { id }= router.query;


  function getUserInfo() {
    fetch(`${apiUrl}/user/${id}`,{
        method: "GET",
        headers: {
            "token": `${value}`,
        }
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        if(!data.error){
            setUser(await data.user)
            console.log(data)
        } else{
            console.error(data.error)
            router.push('/users')
        }
      }
    );
  }

  function getCourses() {
    fetch(`${apiUrl}/courses`,{
        method: "GET",
        headers: {
            "token": `${value}`,
        }
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        setCourses(await data.course)
        console.log(data.course)
      }
    );
  }
  function removeUser(id){
    if(id != null){
        fetch(`${apiUrl}/user/${user.id}` ,{
            method: "DELETE",
            headers: {
                "token": `${value}`
            }
        })
        .then((response) => response.json())
        .then(
          async (data) => {
            console.log(data)
          }
        );
        router.push('/users')
    }
  }
  function addToCourse(id){
    if(id != null){
        fetch(`${apiUrl}/user/${user.id}/course/${id}`,{
            method: "PUT",
            headers: {
                "token": `${value}`
            }
        })
        .then((response) => response.json())
        .then(
          async (data) => {
            console.log(data)
            getUserInfo()
          }
        );
    }
  }

  useEffect(()=>{if (router.asPath !== router.route) {getUserInfo()}},[router])
  useEffect(()=>{getCourses()},[])

  
  return( 
<div>
  {user && (
    <div class="flex w-full bg-orange-600 h-30 justify-around">
      <p class="font-medium text-xl text-white">{user.name}</p>
      <Link class="font-normal text-xl text-white underline hover:no-underline" href={`/courses`}>Курси</Link>
      <Link class="font-normal text-xl text-white underline hover:no-underline" href={`/staff`}>Вчителя</Link>
      <Link class="font-normal text-xl text-white underline hover:no-underline" href={`/users`}>Учені</Link>
      <Link class="font-normal text-xl text-white underline hover:no-underline" href={`/modules`}>Модулі</Link>
      <Link class="font-normal text-xl text-white underline hover:no-underline" href={`//worldLists`}>Список слів</Link>
    </div>
  )}
  {user && (
    <div class="mx-10">
      <h2>user</h2>
      <div class="columns-5 border-b-2 border-gray-200 py-4">
        <p>Ім'я</p>
        <p>Прізвище</p>
        <p>Курс</p>
        <p>Пароль</p>
        <p>Вік</p>
      </div>
      <div class="columns-5 border-b-2 border-gray-200 py-4">
        <p>{user.name}</p>
        <p>{user.surname}</p>
        <p>{user.course}</p>
        <p>{user.password}</p>
        <p>{user.yearsOld}</p>
      </div>
      <div >
        <button class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={() => removeUser(user.id)}>
          Видалити учня повністю
        </button>
      </div>
    </div>
  )}
  {courses && (
    <div class = "flex flex-row bg-slate-300 px-5 py-8 gap-3">
      <select onChange={(choice) => setUserChoice(choice.target.value)} name="courses">
        <option></option>
        {courses.map((course, idx) => (
          <option key={idx} value={course.id}>{course.name}</option>
        ))}
      </select>
      <button class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={() => addToCourse(userChoice)}>
        додати до курсу
      </button>
      <button class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={() => addToCourse(0)}>
        Видалити з курсу
      </button>
    </div>
  )}
</div>
  )
}
