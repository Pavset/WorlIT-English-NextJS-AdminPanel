import Image from "next/image";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export default function GetTheory() {
  const apiUrl = 'http://localhost:8000'
  const [theory, setTheory] = useState()

  const [sections, setSections] = useState()
  const [sectionId, setSectionId] = useState()
  const [sectionCreate, setSectionCreate] = useState(false)

  const [newSectionTitle, setNewSectionTitle] = useState()
  const [newSectionText,  setNewSectionText] = useState()
  const [newSectionImage, setNewSectionImage] = useState()

  const [createSectionTitle, setCreateSectionTitle] = useState()
  const [createSectionText,  setCreateSectionText] = useState()
  const [createSectionImage, setCreateSectionImage] = useState()

  const [cookies, setCookie] = useCookies(['token'])
  const [error, setError] = useState([])
  const [load, setLoading] = useState([])
  const value = cookies.token
  
  const router = useRouter()
  const { id }= router.query;

  function getTheorysInfo() {
    fetch(`${apiUrl}/theory/${id}`,{
        method: "GET",
        headers: {
            "token": `${value}`,
        }
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        if(!data.error){
          setTheory(await data.info)
          setSections(await data.sections)
          console.log(data)
      } else{
          console.error(data.error)
        //   router.push('/theorys')
      }
      }
    );
  }

  function removeTheory(){
    fetch(`${apiUrl}/theory/${id}` ,{
        method: "DELETE",
        headers: {
            "token": `${value}`
        }
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        console.log(await data)
        router.push('/theorys')
      }
    );
  }

  function changeSection(){
    fetch(`${apiUrl}/section/${sectionId}`, {
      method: "PUT",
      headers: {
        "token": `${value}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({   
        title: newSectionTitle,
        text: newSectionText,
        imagePath: newSectionImage,
    })
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        console.log(data)
        setSectionId(null) 
        getTheorysInfo()
      }
    );
  }

  function createSection(){
    fetch(`${apiUrl}/section`, {
      method: "POST",
      headers: {
        "token": `${value}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({   
        title: createSectionTitle,
        text: createSectionText,
        imagePath: createSectionImage,
        theory: Number(id)
    })
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        if(!data.error){

            console.log(await data)
            setSectionCreate(false)
            getTheorysInfo()
        } else{
            console.error(data.error)
        }
      }
    );
  }

  function delSection(sectionId){
    fetch(`${apiUrl}/section/${sectionId}`, {
      method: "DELETE",
      headers: {
        "token": `${value}`,
    }
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        if(!data.error){
            console.log(await data)
            getTheorysInfo()
        } else{
            console.error(data.error)
        }
      }
    );
  }

  function replaceHighlighting(text){
    const regex = /~(.*?)~/g;
  
    // Using regular expression to replace ~...~ with <Text> components in React Native
    const parts = [];
    let lastIndex = 0;
  
    text.replace(regex, (match, p1, offset) => {
      // Add text up to the current match
      if (offset > lastIndex) {
        parts.push(text.substring(lastIndex, offset));
      }
      // Add the selected text as a <Text> component
      parts.push(<strong >{p1.trim()}</strong>);
      // Updating the last index
      lastIndex = offset + match.length;
    });
  
    // Add the remaining text after the last match
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
  
    return parts;
  };

  function modalOpen(){
    
  }

  useEffect(()=>{if (router.asPath !== router.route) {getTheorysInfo()}},[router])
  return( 
    <div>
        { theory && 
        <div>
            <h3>Ім'я: {theory.name}</h3>

            <button onClick={() => removeTheory()}>
                Видалити теорію
            </button>

        </div>
        }
        {sections &&
        <div>
            <h3>Секції</h3>
            {sections.map((section, idx)=>{

                return(
                    <div key={idx}>
                        <h4>{section.title}</h4>
                        <p>{replaceHighlighting(section.text)}</p>
                        {section.imagePath &&
                            <Image src={section.imagePath} width={200} height={200}/>
                        }
                        <button onClick={()=>{ 
                            setSectionId(section.id)
                            setNewSectionTitle(section.title)
                            setNewSectionText(section.text)
                            setNewSectionImage(section.imagePath)
                        }}>
                            змінити секцію
                        </button>
                        <button onClick={()=>{ 
                            delSection(section.id)
                        }}>
                            Видалити секцію
                        </button>
                    </div>
                )
            })}
            { sectionId &&
            <div>
                <h1>Модальне окно зміни секції</h1>
                <input type="text" value={newSectionTitle} onChange={(e)=>{ setNewSectionTitle(e.target.value) }} placeholder="Газва секції"/>
                <textarea onChange={(e)=>{ setNewSectionText(e.target.value)}}>{newSectionText}</textarea>
                <input type="text" value={newSectionImage} onChange={(e)=>{ setNewSectionImage(e.target.value) }} placeholder="Зображеня у секції"/>
                <button onClick={()=>{ 
                    changeSection()
                }}>
                    підтвердити зміну
                </button>
            </div>
            }
        </div>
        }
        { sectionCreate &&
            <div>
                <h1>Модальне окно додавання</h1>
                <input type="text" value={createSectionTitle} onChange={(e)=>{ setCreateSectionTitle(e.target.value) }} placeholder="Газва секції"/>
                <textarea onChange={(e)=>{ setCreateSectionText(e.target.value)}}></textarea>
                <input type="text" value={createSectionImage} onChange={(e)=>{ setCreateSectionImage(e.target.value) }} placeholder="Зображеня у секції"/>
                <button onClick={()=>{ 
                    createSection()
                }}>
                    Дотати
                </button>
            </div>
        }
        <button onClick={()=>{ 
            setSectionCreate(true)
        }}>Додати секцію</button>

    </div>
  )
}
