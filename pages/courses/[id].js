
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export default function GetProduct() {
  const apiUrl = 'http://localhost:8000'
  const [course, setCourse] = useState()
  const [users, setUsers] = useState()
  const [staff, setStaff] = useState()

  const [name, setName] = useState()
  const [manager, setManager] = useState()
  const [teacher, setTeacher] = useState()

  const [managerInfo, setManagerInfo] = useState()
  const [teacherInfo, setTeacherInfo] = useState()

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
        if(!data.error){
          setCourse(await data.course)
          setUsers(await data.users)
          setManagerInfo(await data.manager)
          setTeacherInfo(await data.teacher)
          console.log(data)
      } else{
          console.error(data.error)
          router.push('/courses')
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

  function editCourse(){
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
  useEffect(() =>{getStaff()},[])
  return( 
    <div>
        { course && teacherInfo && managerInfo &&
        <div>
            <h3>Ім'я: {course.name}</h3>
            <h3>Вчитель: {teacherInfo.name} {teacherInfo.surname}</h3>
            <h3>Менаджер: {managerInfo.name} {managerInfo.surname}</h3>

            <button onClick={() => removeCourse()}>
                Видалити курс повністю
            </button>
            {staff &&
            <div>
                <input type='text' value={name} onChange={(event)=>{
                  setName(event.target.value)
                }}/>

                <select onChange={(choice) => setTeacher(choice.target.value)} name="teacher">
                  <option></option>
                  {staff.map((person, idx)=>{
                    return(
                      <option key={idx} value={person.id}>{person.name} {person.surname}</option>
                    )
                  })}
                </select>

                <select onChange={(choice) => setManager(choice.target.value)} name="manager">
                  <option></option>
                  {staff.map((person, idx)=>{
                    return(
                      <option key={idx} value={person.id}>{person.name} {person.surname}</option>
                    )
                  })}
                </select>
                <button onClick={() => editCourse()}>
                  змінити інформацію
                </button>
            </div>
            }
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
                            <button onClick={() => router.push(`/users/${user.id}`)}>
                                повна інформація
                            </button>
                        </div>
                    )
                })}
            </div>
        }
    </div>
  )
}
