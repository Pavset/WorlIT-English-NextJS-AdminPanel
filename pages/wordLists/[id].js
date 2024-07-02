
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export default function GetwordList() {
  const apiUrl = 'http://localhost:8000'
  const [wordList, setWordList] = useState()
  const [newWordListWord, setNewWordListWord] = useState()


  const [words, setWords] = useState([])
  const [wordId, setWordId] = useState()
  const [wordCreate, setWordCreate] = useState(false)

  const [newWordWord, setNewWordWord] = useState()
  const [newWordTranslated,  setNewWordTranslated] = useState()
  const [newWordRole, setNewWordRole] = useState()

  const [createWordWord, setCreateWordWord] = useState()
  const [createWordTranslated,  setCreateWordTranslated] = useState()
  const [createWordRole, setCreateWordRole] = useState()

  const [cookies, setCookie] = useCookies(['token'])
  const [error, setError] = useState([])
  const [load, setLoading] = useState([])
  const value = cookies.token
  
  const router = useRouter()
  const { id }= router.query;

  function getWordListInfo() {
    fetch(`${apiUrl}/wordList/${id}`,{
        method: "GET",
        headers: {
            "token": `${value}`,
        }
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        
        if(!data.error){
          setWordList(await data.wordList)
          if(await data.words){
            setWords(await data.words)
          }
          console.log(data)
      } else{
          console.error(data.error)
          router.push('/modules')
      }
      }
    );
  }

  function removeWordList(){
    fetch(`${apiUrl}/wordList/${id}` ,{
        method: "DELETE",
        headers: {
          "token": `${value}`,
        }
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        console.log(await data)
        router.push('/wordLists')
      }
    );
  }

  function changeWordList(){
    fetch(`${apiUrl}/wordList/${id}` ,{
        method: "PUT",
        headers: {
          "token": `${value}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({   
          name: newWordListWord,
      })
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        console.log(await data)
        getWordListInfo()
      }
    );
  }

  function changeWord(){
    fetch(`${apiUrl}/word/${wordId}`, {
      method: "PUT",
      headers: {
        "token": `${value}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({   
        word: newWordWord,
        translated: newWordTranslated,
        tolePath: newWordRole,
    })
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        console.log(data)
        setWordId(null) 
        getWordListInfo()
      }
    );
  }

  function createWord(){
    fetch(`${apiUrl}/word`, {
      method: "POST",
      headers: {
        "token": `${value}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({   
        word: createWordWord,
        translated: createWordTranslated,
        role: createWordRole,
        wordList: Number(id)
    })
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        if(!data.error){

            console.log(await data)
            setWordCreate(false)
            getWordListInfo()
        } else{
            console.error(data.error)
        }
      }
    );
  }

  function delWord(wordId){
    fetch(`${apiUrl}/word/${wordId}`, {
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
            getWordListInfo()
        } else{
            console.error(data.error)
        }
      }
    );
  }

  useEffect(()=>{if (router.asPath !== router.route) {getWordListInfo()}},[router])
  return( 
    <div>
        { wordList && 
        <div>
            <h3>Ім'я: {wordList.name}</h3>

            <button onClick={() => removeWordList()}>
                Видалити теорію
            </button>
            <div>
              <input onChange={( e ) => {setNewWordListWord(e.target.value)}} placeholder="Нова назва"/>
              <button onClick={() => {changeWordList()} }>змінити назву списку слів</button>
            </div>
        </div>
        }
        {words &&
        <div>
            <h3>Слова</h3>
            {words.map((word, idx)=>{

                return(
                    <div key={idx}>
                        <h4>{word.word}</h4>
                        <h4>{word.translated}</h4>
                        <h4>{word.role}</h4>

                        <button onClick={()=>{ 
                            setWordId(word.id)
                            setNewWordWord(word.Word)
                            setNewWordTranslated(word.Translated)
                            setNewWordRole(word.RolePath)
                        }}>
                            змінити слово
                        </button>
                        <button onClick={()=>{ 
                            delWord(word.id)
                        }}>
                            Видалити слово
                        </button>
                    </div>
                )
            })}
            { wordId &&
            <div>
                <h1>Модальне окно зміни слова</h1>
                <input type="text" value={newWordWord} onChange={(e)=>{ setNewWordWord(e.target.value) }} placeholder="Назва слова"/>
                <input type="text" value={newWordTranslated} onChange={(e)=>{ setNewWordTranslated(e.target.value)}} placeholder="Переклад слова"/>
                <select onChange={(e)=>{ setNewWordRole(e.target.value) }}>
                    <option></option>
                    <option value={"Іменник"}>Іменник</option>
                    <option value={"Прикметник"}>Прикметник</option>
                    <option value={"Дієслово"}>Дієслово</option>
                </select>
                <button onClick={()=>{ 
                    changeWord()
                }}>
                    підтвердити зміну
                </button>
            </div>
            }
        </div>
        }
        { wordCreate &&
            <div>
                <h1>Модальне окно додавання</h1>
                <input type="text" value={createWordWord} onChange={(e)=>{ setCreateWordWord(e.target.value) }} placeholder="Назва слова"/>
                <input type="text" value={createWordTranslated} onChange={(e)=>{ setCreateWordTranslated(e.target.value) }} placeholder="Переклад слова"/>
                <select onChange={(e)=>{ setCreateWordRole(e.target.value) }}>
                    <option></option>
                    <option value={"Іменник"}>Іменник</option>
                    <option value={"Прикметник"}>Прикметник</option>
                    <option value={"Дієслово"}>Дієслово</option>
                </select>
                <button onClick={()=>{ 
                    createWord()
                }}>
                    Дотати
                </button>
            </div>
        }
        <button onClick={()=>{ 
            setWordCreate(true)
        }}>Додати слово</button>

    </div>
  )
}
