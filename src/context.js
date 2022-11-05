import axios from 'axios'
import React, { useState, useContext, useEffect } from 'react'

const table = {
  sports: 21,
  history: 23,
  politics: 24,
}

const API_ENDPOINT = 'https://opentdb.com/api.php?'

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [waiting, setWaiting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quiz, setQuiz] = useState({
    amount: 10,
    category: 'sports',
    difficulty: 'easy'
  });

  // const { amount, category, difficulty } = quiz;

  // const url = `${API_ENDPOINT}amount=${amount}&difficulty=${difficulty}&category=${table[category]}&type=multiple`


  const fetchQuestions = async (url) => {
    setLoading(true);
    setWaiting(false);

    try {
      const { data: { results: fetchedData } } = await axios(url);

      if (fetchedData.length > 0) {
        setQuestions(() => fetchedData);
        setLoading(false);
        // setWaiting(false);
        setError(false);
      }

    } catch (error) {
      setWaiting(true);
      setError(true);

      console.log(error)
    }
  }

  // useEffect(() => {
  //   fetchQuestions(url)
  // }, [])

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setQuiz({ ...quiz, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const { amount, category, difficulty } = quiz;
    const url = `${API_ENDPOINT}amount=${amount}&difficulty=${difficulty}&category=${table[category]}&type=multiple`

    fetchQuestions(url);
  }

  const nextQuestion = () => {
    setIndex((oldIndex) => {
      const newIndex = oldIndex + 1;

      if (newIndex > questions.length - 1) {
        openModal()
        return 0;
      }
      return newIndex;
    });
  }

  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setWaiting(true);
    setCorrect(0);
  }

  const checkAnswer = value => {
    if (value) {
      setCorrect(oldState => oldState + 1);
    }
    nextQuestion();
  }

  return <AppContext.Provider value={{ waiting, loading, questions, index, correct, error, isModalOpen, nextQuestion, checkAnswer, openModal, closeModal, handleChange, handleSubmit, quiz }}>{children}</AppContext.Provider>
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
