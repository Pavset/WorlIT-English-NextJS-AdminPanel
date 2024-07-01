
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export default function GetProduct() {
  const apiUrl = 'http://localhost:8000'
  const [staff, setStaff] = useState()

  const [name, setName] = useState()
  const [manager, setManager] = useState()
  const [teacher, setTeacher] = useState()

  const [cookies, setCookie] = useCookies(['token'])
  const [error, setError] = useState([])
  const [load, setLoading] = useState([])
  const value = cookies.token
  
  const router = useRouter()

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

  function createCourse() {
    console.log(name)
    console.log(manager)
    console.log(teacher)
    fetch(`${apiUrl}/courses`,{
        method: "POST",
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
        if(!data.error){
          console.log(await data)
          router.push(`/courses/${await data.course.id}`)
      } else{
          console.error(data.error)
      }
      }
    );
  }

  useEffect(() =>{getStaff()},[])
  return( 
    <div>
        {staff &&
        <div>
            <input type='text' required value={name} onChange={ (event)=>{setName(event.target.value) }}/>

            <select required onChange={(choice) => setTeacher(choice.target.value)} name="teacher">
              <option></option>
              {staff.map((person, idx)=>{
                return(
                  <option key={idx} value={person.id}>{person.name} {person.surname}</option>
                )
              })}
            </select>

            <select required onChange={(choice) => setManager(choice.target.value)} name="manager">
              <option></option>
              {staff.map((person, idx)=>{
                return(
                  <option key={idx} value={person.id}>{person.name} {person.surname}</option>
                )
              })}
            </select>

            <button onClick={() => createCourse()}>
              Створити курс
            </button>

        </div>
        }
    </div>
  )
}
