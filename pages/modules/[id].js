
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export default function GetProduct() {
  const apiUrl = 'http://localhost:8000'
  const [module, setModule] = useState()
  const [topics, setTopics] = useState()
  const [nameChanged, setNameChanged] = useState()
//   const [homeworks, setHomeworks] = useState()
//   const [tasks, setTasks] = useState()
//   const [theory, setTheories] = useState()


  const [cookies, setCookie] = useCookies(['token'])
  const [error, setError] = useState([])
  const [load, setLoading] = useState([])
  const value = cookies.token
  
  const router = useRouter()
  const { id }= router.query;

  function getModulesInfo() {
    fetch(`${apiUrl}/module/${id}`,{
        method: "GET",
        headers: {
            "token": `${value}`,
        }
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        if(!data.error){
          setModule(await data.module)
          setTopics(await data.topicsList)
          console.log(data)
      } else{
          console.error(data.error)
          router.push('/modules')
      }
      }
    );
  }

  function removeModule(){
    fetch(`${apiUrl}/module/${id}` ,{
        method: "DELETE",
        headers: {
            "token": `${value}`
        }
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        console.log(await data)
        router.push('/modules')
      }
    );
  }


  function editmodule(){
    fetch(`${apiUrl}/module/${id}`, {
      method: "PUT",
      headers: {
        "token": `${value}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({   
        name: nameChanged,
    })
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        console.log(data)
        getModulesInfo()
      }
    );
  }
  useEffect(()=>{if (router.asPath !== router.route) {getModulesInfo()}},[router])
  return( 
    <div>
        { module && 
        <div>
            <h3>Ім'я: {module.name}</h3>

            <button onClick={() => removeModule()}>
                Видалити модуль повністю
            </button>

        </div>
        }
        { topics && 
        <div>
            {topics.map((topic, idx)=>{
                let homeworks = topic.homework
                let tasks = topic.tasks
                let theories = topic.theories

                let tasksVideoCounter = 0
                let tasksTestCounter = 0
                let tasksWordsCounter = 0
                let tasksRoutesCounter = 0
                let tasksSentencesCounter = 0
                let tasksAudioCounter = 0

                let homeVideoCounter = 0
                let homeTestCounter = 0
                let homeWordsCounter = 0
                let homeRoutesCounter = 0
                let homeSentencesCounter = 0
                let homeAudioCounter = 0

                return(
                    <div key={idx}>

                        <h2>{topic.name}</h2>
                        <h2>{topic.mainName}</h2>
                        { theories &&
                            <div>
                                <h3>теорії</h3>
                                {theories.map((theory,theoryIdx)=>{
                                    return(
                                        <button key={theoryIdx} onClick={()=>{ router.push(`/theories/${theory.id}`) }}>{theory.name} {theory.mainName}</button>
                                    )
                                })}
                            </div>
                        }

                        {tasks &&                        
                            <div>          
                                <h3>таски</h3>
                                {tasks.map((task,taskIdx)=>{
                                    let counter
                                    if (task.type == "video"){
                                        // typeImage = require("../assets/video.png")
                                        tasksVideoCounter += 1
                                        counter = tasksVideoCounter
                                      } else if (task.type == "test"){
                                        // typeImage = require("../assets/test.png")
                                        tasksTestCounter += 1
                                        counter = tasksTestCounter
                                      } else if (task.type == "words"){
                                        // typeImage = require("../assets/words.png"
                                        tasksWordsCounter += 1
                                        counter = tasksWordsCounter
                                      } else if (task.type == "routes"){
                                        // typeImage = require("../assets/routes.png")
                                        tasksRoutesCounter += 1
                                        counter = tasksRoutesCounter
                                      } else if (task.type == "sentences"){
                                        // typeImage = require("../assets/sentences.png")
                                        tasksSentencesCounter += 1
                                        counter = tasksSentencesCounter
                                      } else if (task.type == "audio"){
                                        // typeImage = {uri: "https://img.icons8.com/ios/100/high-volume--v1.png"}
                                        tasksAudioCounter += 1
                                        counter = tasksAudioCounter
                                      }
                                    return(
                                        <button key={taskIdx} onClick={()=>{ router.push(`/tasks/${task.id}`) }}>{task.type}{counter}</button>
                                    )
                                })}
                            </div>    
                        }

                        {homeworks &&                        
                            <div>          
                                <h3>Домашні завдання</h3>
                                {homeworks.map((home, homeIdx)=>{
                                    let counter
                                    if (home.type == "video"){
                                        // typeImage = require("../assets/video.png")
                                        homeVideoCounter += 1
                                        counter = homeVideoCounter
                                      } else if (home.type == "test"){
                                        // typeImage = require("../assets/test.png")
                                        homeTestCounter += 1
                                        counter = homeTestCounter
                                      } else if (home.type == "words"){
                                        // typeImage = require("../assets/words.png"
                                        homeWordsCounter += 1
                                        counter = homeWordsCounter
                                      } else if (home.type == "routes"){
                                        // typeImage = require("../assets/routes.png")
                                        homeRoutesCounter += 1
                                        counter = homeRoutesCounter
                                      } else if (home.type == "sentences"){
                                        // typeImage = require("../assets/sentences.png")
                                        homeSentencesCounter += 1
                                        counter = homeSentencesCounter
                                      } else if (home.type == "audio"){
                                        // typeImage = {uri: "https://img.icons8.com/ios/100/high-volume--v1.png"}
                                        homeAudioCounter += 1
                                        counter = homeAudioCounter
                                      }                                    
                                    return(
                                        <button key={homeIdx} onClick={()=>{ router.push(`/tasks/${home.id}`) }}>{home.type}{counter}</button>
                                    )
                                })}
                            </div>
                        }

                    </div>

                )

            })}
            <h3>Ім'я: {module.name}</h3>

            <button onClick={() => removeModule()}>
                Видалити модуль повністю
            </button>

        </div>
        }
    </div>
  )
}
