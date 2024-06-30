import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export default function Course() {
    const apiUrl = 'http://localhost:8000'
    const [courses, setCourses] = useState()    
    const [cookies, setCookie] = useCookies(['token'])
    const [error, setError] = useState([])
    const [load, setLoading] = useState([])
    const value = cookies.token
    const router = useRouter()


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
    useEffect(()=>{getCourses()},[])

  
  return( 
    <div>
        { courses &&
            <div>
                {courses.map((course, idx)=>{
                    return(
                        <button key={idx} onClick={()=>{
                            router.push(`courses/${course.id}`)
                        }}>
                            {course.name}
                        </button>
                    )
                })
                }
            </div>
        }
    </div>
  )
}
