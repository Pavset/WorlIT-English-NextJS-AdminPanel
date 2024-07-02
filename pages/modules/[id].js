"use client"

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export default function GetProduct() {
  const apiUrl = 'http://localhost:8000'
  const [module, setModule] = useState()
  const [topics, setTopics] = useState()
  const [wordLists, setWordLists] = useState()

  const [nameChanged, setNameChanged] = useState()
  const [theoryCreationName, setTheoryCreationName] = useState()
  const [creationTopicId, setCreationTopicId] = useState()
  const [tasksWordListId, setTasksWordListId] = useState()
  const [tasksType, setTasksType] = useState()
  const [notHomework, setNotHomework] = useState()


//   const [tasks, setTasks] = useState()
//   const [theory, setTheories] = useState()

  const [openTheoryModal ,setOpenTheoryModal] = useState(false)
  const [openTasksModal ,setOpenTasksModal] = useState(false)
  const [openHomeModal ,setOpenHomeModal] = useState(false)


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
      }
      }
    );
  }

  function getWordLists() {
    fetch(`${apiUrl}/wordList`,{
        method: "GET",
        headers: {
            "token": `${value}`,
        }
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        if(!data.error){
          setWordLists(await data.wordLists)
          console.log(data.wordLists)
      } else{
          console.error(data.error)
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
    })})
    .then((response) => response.json())
    .then(
      async (data) => {
        console.log(data)
        getModulesInfo()
      }
    );
  }

  function createTheory(){
    console.log(theoryCreationName)
    console.log(creationTopicId)
    fetch(`${apiUrl}/theory`, {
      method: "POST",
      headers: {
        "token": `${value}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({   
        name: theoryCreationName,
        topicId: creationTopicId
    })})
    .then((response) => response.json())
    .then(
      async (data) => {
        console.log(data)
        router.push(`/theories/${data.theory.id}`)
      }
    );
  }

  function createTask(){
    console.log(tasksType)
    console.log(tasksWordListId)
    fetch(`${apiUrl}/task`, {
      method: "POST",
      headers: {
        "token": `${value}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({   
        type: tasksType,
        wordArray: tasksWordListId,
        topicId: creationTopicId,
        notHomework: notHomework
    })})
    .then((response) => response.json())
    .then(
      async (data) => {
        console.log(data)
        // router.push(`/tasks/${data.task.id}`)
      }
    );
  }

  useEffect(()=>{if (router.asPath !== router.route) {getModulesInfo()}},[router])
  useEffect(()=>{getWordLists()},[])

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
        {openTheoryModal &&
          <div>
            <h1>Модальне окно додавання теорії</h1>
            <input type="text" value={theoryCreationName} onChange={(e)=>{ setTheoryCreationName(e.target.value) }} placeholder="Назва теорії"/>
            <button onClick={()=>{ createTheory() }}>Створити теорію</button>
          </div>
        }
        {openTasksModal &&
          <div>
            <h1>Модальне окно додавання таски</h1>
            <select onChange={(e)=>{ setTasksType(e.target.value) }}>
              <option></option>
              <option value="video">video</option>
              <option value="test">test</option>
              <option value="words">words</option>
              <option value="routes">routes</option>
              <option value="sentence">sentence</option>
              <option value="audio">audio</option>
            </select>
            {wordLists &&
              <select onChange={(e)=>{ setTasksWordListId(e.target.value) }}>
                <option></option>
                {wordLists.map((list, idx)=>{
                  return(
                    <option key={idx} value={list.id}>{list.name}</option>
                  )
                })}
              </select>
            }
            <button onClick={()=>{ createTask() }}>Створити теорію</button>
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
                                <button onClick={()=>{ 
                                  setOpenTheoryModal(true) 
                                  console.log(topic.topicId)
                                  setCreationTopicId(topic.topicId)
                                  
                                }}>Додати теорію</button>

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
                                        <button key={taskIdx} onClick={()=>{ router.push(`/tasks/${task.id}`) }}>{task.type} {counter}</button>
                                    )
                                })}
                                <button onClick={()=>{ 
                                  setOpenTasksModal(true) 
                                  console.log(topic.topicId)
                                  setCreationTopicId(topic.topicId)
                                  setNotHomework(true)
                                }}>Додати таску</button>
                                
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
                                        <button key={homeIdx} onClick={()=>{ router.push(`/tasks/${home.id}`) }}>{home.type} {counter}</button>
                                    )
                                })}
                                <button onClick={()=>{ 
                                  setOpenTasksModal(true) 
                                  console.log(topic.topicId)
                                  setCreationTopicId(topic.topicId)
                                  setNotHomework(false)
                                }}>Додати дз</button>
                            </div>
                        }

                    </div>

                )

            })}
        </div>
        }
    </div>
  )
}
