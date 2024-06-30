import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export default function GetProduct() {
    const apiUrl = 'http://localhost:8000'
    const [course, setCourse] = useState()
    const [users, setUsers] = useState()
    const [userChoice, setUserChoice] = useState()

    const [name, setName] = useState()
    const [manager, setManager] = useState()
    const [teacher, setTeacher] = useState()

    const [cookies, setCookie] = useCookies(['token'])
    const [error, setError] = useState([])
    const [load, setLoading] = useState([])
    const value = cookies.token
    
    const router = useRouter()
    const { id }= router.query;

  function getCoursesInfo() {
    fetch(`${apiUrl}/course/${id}`,{
        method: "GET",
        headers: {
            "token": `${value}`,
        }
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        setCourse(await data.course)
        setUsers(await data.users)
        console.log(data.course)
      }
    );
  }
  function removeCourse(){
    fetch(`${apiUrl}/course/${id}` ,{
        method: "DELETE",
        headers: {
            "token": `${value}`
        }
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        console.log(await data)
        router.push('/courses')
      }
    );
  }

  function removeFromCourse(userId){
    if(userId != null){
        fetch(`${apiUrl}/user/${userId}/course/${id}`,{
            method: "PUT",
            headers: {
                "token": `${value}`
            }
        })
        .then((response) => response.json())
        .then(
          async (data) => {
            console.log(data)
            getCoursesInfo()
          }
        );
    }
  }

  function editCourse(name, manager, teacher){
    fetch(`${apiUrl}/course/${id}`, {
      method: "PUT",
      headers: {
        "token": `${value}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({   
        name: name,
        manager: manager,
        teacher: teacher
    })
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        console.log(data)
        getCoursesInfo()
      }
    );
  }
  useEffect(()=>{if (router.asPath !== router.route) {getCoursesInfo()}},[router])
  return( 
    <div>
        { course &&
        <div>
            <h3>Ім'я: {course.name}</h3>
            <h3>Вчитель: {course.teacher}</h3>
            <h3>Менаджер: {course.manager}</h3>
            <div>
            
            </div>
            <button onClick={() => removeCourse()}>
                Видалити курс повністю
            </button>
            <form>
                <input type='text' />

            </form>
        </div>
        }
        
        {users &&
            <div>
                <h3>Учні</h3>
                {users.map((user, idx)=>{
                    return(
                        <div key={idx}>
                            <hr/>
                            <h3>{user.name}</h3>
                            <h3>{user.surname}</h3>
                            <h3>{user.yearsOld}</h3>
                            <button onClick={() => removeFromCourse(user.id)}>
                                Видалити з курсу
                            </button>
                        </div>
                    )
                })}
            </div>
        }
    </div>
  )
}
