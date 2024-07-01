import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

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
        { user &&
        <div>
            <h2>user</h2>
            <div>
                <h3>ім'я: {user.name}</h3>
                <h3>ім'я: {user.surname}</h3>
                <h3>курс: {user.course}</h3>
                <h3>пароль: {user.password}</h3>
                <h3>вік: {user.yearsOld}</h3>
            </div>
            <button onClick={() => removeUser(user.id)}>
                Видалити учня повністю
            </button>
        </div>
        }
        { courses &&
            <div>
                <select onChange={(choice) => setUserChoice(choice.target.value)} name="courses">
                  <option></option>
                    {courses.map((course, idx)=>{
                        return(
                            <option key={idx} value={course.id}>{course.name}</option>
                        )
                    })
                    }
                </select>
                <button onClick={() => addToCourse(userChoice)}>
                    додати до курсу
                </button>
                <button onClick={() => addToCourse(0)}>
                    Видалити з курсу
                </button>
            </div>
        }
    </div>
  )
}
