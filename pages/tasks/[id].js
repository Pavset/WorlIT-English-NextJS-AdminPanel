// "use client"
import Image from "next/image";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export default function GetTask() {
  const apiUrl = 'http://localhost:8000'
  const [task, setTask] = useState()
  const [questions, setQuestions] = useState()
  const [wordLists, setWordLists] = useState()

  const [createModalOpened, setCreateModalOpened] = useState()
  const [taskTypesChoice, setTaskTypesChoice] = useState(null)

  const [mediaNew, setMediaNew] = useState(null)
  const [taskUpdateType, setTaskUpdateType] = useState()
  const [taskUpdateWordArray, setTaskUpdateWordArray] = useState()
  const [taskUpdateInitialyBlocked, setTaskUpdateInitialyBlocked] = useState()
  const [taskUpdateUnlockingTaskId, setTaskUpdateUnlockingTaskId] = useState()
  

  const [questionUpdateId,setQuestionUpdateId] = useState()
  const [questionUpdateType,setQuestionUpdateType] = useState()
  const [questionUpdateText,setQuestionUpdateText] = useState()
  const [questionUpdateExtraText,setQuestionUpdateExtraText] = useState()
  const [questionUpdateImage,setQuestionUpdateImage] = useState()
  const [questionUpdateTrueAnswers,setQuestionUpdateTrueAnswers] = useState()
  const [questionUpdateWrongAnswers,setQuestionUpdateWrongAnswers] = useState(
    {
        answer1: "",
        answer2: "",
        answer3: "",
        answer4: "",
        answer5: "",
      }
  )


  const [creationQuestionText, setCreationQuestionText] = useState()
  const [creationExtraQuestionText, setCreationExtraQuestionText] = useState()
  const [creationImage, setCreationImage] = useState()
  const [creationTrueAnswers, setCreationTrueAnswers] = useState()
  const [creationWrongAnswers, setCreationWrongAnswers] = useState({
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    answer5: "",
  })
  function formWrongAnswersInput(event){
    const name = event.target.name
    const value = event.target.value
    setCreationWrongAnswers(previous =>({
        ...previous,
        [name]: value
    })) 
  }



  const [cookies, setCookie] = useCookies(['token'])
  const [error, setError] = useState([])
  const [load, setLoading] = useState([])
  const value = cookies.token
  
  const router = useRouter()
  const { id }= router.query;

  function getTasksInfo() {
    fetch(`${apiUrl}/task/${id}`,{
        method: "GET",
        headers: {
            "token": `${value}`,
        }
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        if(!data.error){
            setTask(await data.info)
          if(await data.questions){
            setQuestions(await data.questions)
          }
          console.log(data)
      } else{
          console.error(data.error)
          router.push('/modules')
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

  function removeTask(){
    fetch(`${apiUrl}/task/${id}` ,{
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

  function createNewQuestion(){
    let questionType
    let questionTrueList = []
    let questionWrongList = []
    let extraQuestionText
    let questionText
    let questionImage = null

    if(creationImage){
        questionImage = creationImage
    }

    if(taskTypesChoice=="word"){
        questionType = "word"
        questionTrueList.push(creationTrueAnswers)
        extraQuestionText = creationExtraQuestionText
        questionText = creationQuestionText
        questionWrongList = Object.values(creationWrongAnswers)
    } else if (taskTypesChoice=="input"){
        questionType = "input"
        questionTrueList.push(creationTrueAnswers)
        extraQuestionText = creationExtraQuestionText
        questionText = creationQuestionText
    } else if (taskTypesChoice == "multiple particialy"){
        questionType = "multiple"
        questionTrueList = replaceStarsForMultiple(creationQuestionText).matches
        extraQuestionText = creationExtraQuestionText
        questionText = replaceStarsForMultiple(creationQuestionText).newStr
    } else if (taskTypesChoice == "multiple fully"){
        questionType = "multiple"
        extraQuestionText = creationExtraQuestionText
        questionText = null
        questionTrueList = creationQuestionText.replaceAll(",", "").split(' ')
    
    }

    // function updateTask(){
    //     let body = {
    //         wordArray: taskUpdateWordArray,
    //         initialyBlocked: taskUpdateInitialyBlocked,
    //         unlockingTaskId: taskUpdateUnlockingTaskId,
    //         type: taskUpdateType
    //     } 
    //     if(task.type == "video"){
    //         body = {
    //             video: mediaNew
    //         }
    //     } else if (task.type == "audio"){
    //         body = {
    //             audio: mediaNew
    //         }
    //     }


    //     console.log(taskTypesChoice)
    //     fetch(`${apiUrl}/task/${id}`,{
    //         method: "PUT",
    //         headers: {
    //             "token": `${value}`,
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(body)
    //     })
    //     .then((response) => response.json())
    //     .then(
    //       async (data) => {
    //         if(!data.error){
    //           console.log(await data)
    //           getTasksInfo()
    //       } else{
    //           console.error(data.error)
    //       }
    //       }
    //     );
    //   }

    console.log(taskTypesChoice)
    fetch(`${apiUrl}/question`,{
        method: "POST",
        headers: {
            "token": `${value}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            question: questionText,
            questionType: questionType,
            imagePath: questionImage,
            trueAnswers: questionTrueList,
            wrongAnswers: questionWrongList,
            extraQuestionText: extraQuestionText,
            taskId: id,
            wordId: task.wordArray
        })
    })
    .then((response) => response.json())
    .then(
      async (data) => {
        if(!data.error){
          console.log(await data)
          getTasksInfo()
      } else{
          console.error(data.error)
      }
      }
    );
  }

//   function updateQuestion(questionId){
//     let questionTrueList = []
//     let questionWrongList = []
//     let extraQuestionText
//     let questionText
//     let questionImage = null

//     if(creationImage){
//         questionImage = creationImage
//     }

//     console.log(taskTypesChoice)
//     fetch(`${apiUrl}/question/${questionId}`,{
//         method: "PUT",
//         headers: {
//             "token": `${value}`,
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             question: questionText,
//             imagePath: questionImage,
//             trueAnswers: questionTrueList,
//             wrongAnswers: questionWrongList,
//             extraQuestionText: extraQuestionText,
//         })
//     })
//     .then((response) => response.json())
//     .then(
//       async (data) => {
//         if(!data.error){
//           console.log(await data)
//           getTasksInfo()
//       } else{
//           console.error(data.error)
//       }
//       }
//     );
//   }

  function delQuestion(questionId){
    fetch(`${apiUrl}/question/${questionId}`, {
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




  function replaceStarsForMultiple(str) {
    const regex = /\*(\w+)\*/g;
    let matches = [];
    let match;
  
    while ((match = regex.exec(str)) !== null) {
      matches.push(match[1]);
    }
  
    const newStr = str.replace(regex, '...');
  
    return { newStr, matches };
  }

  useEffect(()=>{if (router.asPath !== router.route) {getTasksInfo()}},[router])
  useEffect(()=>{getWordLists()},[])

  return( 
    <div>
        {task &&
            <div>
                <p>{task.id}</p>
                <p>{task.type}</p>
                <br/>
                <br/>
                <br/>
                {task.type == "video" &&
                    <div>
                        <video src={task.video} controls>
                          <p>
                            Your browser doesn't support HTML video. Here is a
                            <a href={task.video}>link to the video</a> instead.
                          </p>
                        </video>
                        <div>
                            <input type="text" value={mediaNew} onChange={(e)=>{setMediaNew(task.id)(e.target.value)}} placeholder="Ссылка на видео"/>
                            {/* <button onClick={()=>{ changeTask() }}>
                                Змінити відео
                            </button> */}
                            <button onClick={()=>{ removeTask() }}>
                                Видалити відео
                            </button>
                        </div>
                    </div>
                }
                {task.type == "audio" &&
                    <div>
                        <audio controls src={task.audio}>
                            <a href={task.audio}> Download audio </a>
                        </audio>
                        <div>
                            <input type="text" value={mediaNew} onChange={(e)=>{setMediaNew(task.id)(e.target.value)}} placeholder="Ссылка на аудіо"/>
                            {/* <button onClick={()=>{ changeTask() }}>
                                Змінити аудіо
                            </button> */}
                            <button onClick={()=>{ removeTask() }}>
                                Видалити аудіо
                            </button>

                        </div>
                    </div>
                }
                {task.type != "audio" && task.type != "video" &&
                    <div>

                    {createModalOpened &&
                        <div>
                            <h1>Створення питання</h1>
                            <select onChange={(choice) => {
                                setTaskTypesChoice(choice.target.value)

                            }} name="taskTypes">
                                <option></option>
                                <option value={"word"}>word</option>
                                <option value={"input"}>input</option>
                                <option value={"multiple fully"}>multiple fully</option>
                                <option value={"multiple particialy"}>multiple particialy</option>
                            </select>
                            {taskTypesChoice == "word" &&
                                <div>

                                    <input type="text" value={creationQuestionText} onChange={(e)=>{setCreationQuestionText(e.target.value)}} placeholder="Основне питання"/>
                                    <input type="text" value={creationExtraQuestionText} onChange={(e)=>{setCreationExtraQuestionText(e.target.value)}} placeholder="Доп питання"/>
                                    <input type="text" value={creationImage} onChange={(e)=>{setCreationImage(e.target.value)}} placeholder="Картинка для питання"/>

                                    <label>Правильна відповідь</label>
                                    <input type="text" value={creationTrueAnswers} onChange={(e)=>{setCreationTrueAnswers(e.target.value.toLowerCase())}}/>
                                    

                                    <label>Неправильні відповіді</label>
                                    <input type="text" name="answer1" value={creationWrongAnswers.answer1.toLowerCase()} onChange={(e) => formWrongAnswersInput(e)}/>
                                    <input type="text" name="answer2" value={creationWrongAnswers.answer2.toLowerCase()} onChange={(e) => formWrongAnswersInput(e)}/>
                                    <input type="text" name="answer3" value={creationWrongAnswers.answer3.toLowerCase()} onChange={(e) => formWrongAnswersInput(e)}/>
                                    <input type="text" name="answer4" value={creationWrongAnswers.answer4.toLowerCase()} onChange={(e) => formWrongAnswersInput(e)}/>
                                    <input type="text" name="answer5" value={creationWrongAnswers.answer5.toLowerCase()} onChange={(e) => formWrongAnswersInput(e)}/>
                                    
                                    <button onClick={()=>{
                                        createNewQuestion()
                                    }}>
                                        Створити
                                    </button>
                                </div>
                            }
                            {taskTypesChoice == "input" &&
                                <div>
                                    <input type="text" value={creationQuestionText} onChange={(e)=>{setCreationQuestionText(e.target.value)}} placeholder="Основне питання"/>
                                    <input type="text" value={creationExtraQuestionText} onChange={(e)=>{setCreationExtraQuestionText(e.target.value)}} placeholder="Доп питання"/>
                                    <input type="text" value={creationImage} onChange={(e)=>{setCreationImage(e.target.value)}} placeholder="Картинка для питання"/>
                                    
                                    <label>Правильна відповідь</label>
                                    <input type="text" value={creationTrueAnswers} onChange={(e)=>{setCreationTrueAnswers(e.target.value.toLowerCase())}}/>
                                    <button onClick={()=>{
                                        createNewQuestion()
                                    }}>
                                        Створити
                                    </button>
                                </div>
                            }
                            {taskTypesChoice == "multiple fully" &&
                                <div>
                                    <input type="text" value={creationQuestionText} onChange={(e)=>{setCreationQuestionText(e.target.value)}} placeholder="Основне питання"/>
                                    <input type="text" value={creationExtraQuestionText} onChange={(e)=>{setCreationExtraQuestionText(e.target.value)}} placeholder="Доп питання"/>

                                    <button onClick={()=>{
                                        createNewQuestion()
                                    }}>
                                        Створити
                                    </button>
                                </div>
                            }
                            {taskTypesChoice == "multiple particialy" &&
                                <div>
                                    <p>Виделіть слова для відповідей символом зірочки * з обох боків</p>
                                    <input type="text" value={creationQuestionText} onChange={(e)=>{setCreationQuestionText(e.target.value)}} placeholder="Основне питання"/>
                                    <input type="text" value={creationExtraQuestionText} onChange={(e)=>{setCreationExtraQuestionText(e.target.value)}} placeholder="Доп питання"/>
                                    <button onClick={()=>{
                                        createNewQuestion()
                                    }}>
                                        Створити
                                    </button>
                                </div>
                            }
                        </div>
                    }
                        <button onClick={()=>{setCreateModalOpened(true)}}>
                            створити питання
                        </button>
                        <button onClick={()=>{ removeTask() }}>
                            Видалити Таску повністю
                        </button>
                        {/* <div>
                            <select onChange={(e)=>{ setTaskUpdateType(e.target.value) }}>
                              <option></option>
                              <option value="test">test</option>
                              <option value="words">words</option>
                              <option value="routes">routes</option>
                              <option value="sentence">sentence</option>
                            </select>
                            {wordLists &&
                                <select onChange={(e)=>{ setTaskUpdateWordArray(e.target.value) }}>
                                    <option></option>
                                    {wordLists.map((list, idx)=>{
                                        return(
                                            <option key={idx} value={list.id}>{list.name}</option>
                                        )
                                    })}
                                </select>
                            }
                            <button onClick={()=>{ changeTask() }}>
                                Змінити таску
                            </button>
                        </div> */}
                    {/* {questionUpdateId &&
                        <div>
                            <h1>Оновлення питання</h1>
                            <input type="text" value={questionUpdateText} onChange={(e)=>{setQuestionUpdateText(e.target.value)}} placeholder="Основне питання"/>
                            <input type="text" value={questionUpdateExtraText} onChange={(e)=>{setQuestionUpdateExtraText(e.target.value)}} placeholder="Доп питання"/>
                            <input type="text" value={questionUpdateImage} onChange={(e)=>{setQuestionUpdateImage(e.target.value)}} placeholder="Картинка для питання"/>
                            {}
                        </div>
                    } */}

                    {questions && 
                            <div>
                                {questions.map((question, idx)=>{
                                    return(
                                        <div key={idx}>
                                            <strong>---------------------------------------------------------------------------------------------------------------------------------------------------------------</strong>
                                            <h2>{question.id}</h2>
                                            <h2>{question.question}</h2>
                                            <h2>{question.questionType}</h2>
                                            <h2>{question.extraQuestionText}</h2>
                                            <h2>{question.wordId}</h2>
                                            <h2>{question.type}</h2>
                                            {question.imagePath &&
                                                <Image src={question.imagePath} width={200} height={200}/>
                                            }
                                            <div>
                                                <hr/>
                                                <h3>Правильні відповіді</h3>
                                                {question.trueAnswers.map((answer, idx)=>{
                                                    return(
                                                        <h4 key={idx}>{answer}</h4>
                                                    )
                                                })}
                                            </div>
                                            <div>
                                                <hr/>
                                                <p>Неправильні відповіді</p>
                                                {question.wrongAnswers.map((answer, idx)=>{
                                                    return(
                                                        <p key={idx}>{answer}</p>
                                                    )
                                                })}
                                            </div>
                                            {/* <button onClick={()=>{
                                                setQuestionUpdateId(question.id)
                                                setQuestionUpdateType(question.type)
                                            }}>
                                                Змінити питання
                                            </button> */}
                                            <button onClick={()=>{
                                                delQuestion(question.id)
                                            }}>
                                                Видалити питання
                                            </button>
                                            <br/>
                                            
                                        </div>
                                    )
                                })}
                            </div>
                    }
                        
                    </div>
                }                
            </div>
        }

    </div>
  )
}
