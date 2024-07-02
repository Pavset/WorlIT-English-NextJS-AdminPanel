import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

import Image from "next/image";

export default function getOneStaff(){
    const apiUrl = 'http://localhost:8000'
    const [cookies, setCookie] = useCookies(['token'])
    const [staff, setStaff] = useState()
    const [name, setName] = useState()
    const [surname, setSurname] = useState()
    const [image, setImage] = useState()
    const [phone, setPhone] = useState()
    const [tg, setTg] = useState()
    const [viber, setViber] = useState()
    // 
    const router = useRouter()
    const { id }= router.query;
    
    const value = cookies.token

    function getStaffInfo() {
        console.log(id)
        fetch(`${apiUrl}/staff/${id}`,{
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
              console.log(data)
          } else{
              console.error(data.error)
          }
          }
        );
      }
    
    function deleteStaff(){
        fetch(`${apiUrl}/staff/${id}`,{
            method: "PUT",
            headers: {
                "token": `${value}`,
            },

        })
        .then((response) => response.json())
        .then(
          async (data) => {
            if(!data.error){
                console.log(data.staff)
                // setImage(data.)
          } else{
                console.error(data.error)
          }
          }
        );
    }

    function editStaff(){
        fetch(`${apiUrl}/staff/${id}`,{
            method: "PUT",
            headers: {
                "token": `${value}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({   
                name: name,
                surname: surname,
                phone: phone,
                image: image,
                tg: tg,
                viber: viber
            })
        })
        .then((response) => response.json())
        .then(
          async (data) => {
            if(!data.error){
                console.log(data.staff)
                getStaffInfo()
                // setImage(data.)
          } else{
                console.error(data.error)
          }
          }
        );
    }



    useEffect(()=>{if (router.asPath !== router.route) {getStaffInfo()}},[router])
    
    return(
        <div>
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

                    <div>
                        <p>{staff.id}</p>
                        <p>{staff.name}</p>
                        <p>{staff.surname}</p>
                        <p>{staff.phone}</p>
                        <p>{staff.tg}</p>
                        <p>{staff.viber}</p>
                        <Image src={staff.image} width={200} height={200}/>
                    </div>
            <button onClick={()=>{ editStaff() }}>
                редач нахой
            </button>
                </div>
            }
            <button onClick = {()=>{deleteStaff()}}>
                удоли
            </button>
        </div>
    )
}