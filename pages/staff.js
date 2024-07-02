import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Link from 'next/link'
// import styles from "./page.module.css";

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
        <div >
            <div>
                
            </div>
            {staff &&
            
                <div>
                    <p>name</p>
                    <input type='text' value={name} onChange={(event)=>{
                    setName(event.target.value)
                    }}/>
                    <p>surname</p>
                    <input type='text' value={surname} onChange={(event)=>{
                    setSurname(event.target.value)
                    }}/>
                    <p>phone</p>
                   <input type='text' value={phone} onChange={(event)=>{
                    setPhone(event.target.value)
                    }}/>
                    <p>tg</p>
                    <input type='text' value={tg} onChange={(event)=>{
                    setTg(event.target.value)
                    }}/>
                    <p>viber</p>
                   <input type='text' value={viber} onChange={(event)=>{
                    setViber(event.target.value)
                    }}/>
                    <p>image</p>
                   <input type='text' value={image} onChange={(event)=>{
                    setImage(event.target.value)
                    }}/>
                    <button onClick={()=>{ createStaff() }}>
                    родить
                    </button>
                    {/* <p>{JSON.stringify(staff)}</p> */}
                    { staff.map((s, idx)=>{
                        return(
                            
                            <div key={idx} >
                                <p>{s.id}</p>
                                <p>{s.name}</p>
                                <p>{s.surname}</p>
                                <Link href={`/staff/${s.id}`}>
                                    повна інформація
                                </Link>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
        
)}