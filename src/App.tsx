import React, { useState } from "react";
import { Difficulty, fetchQuizQuestions, QuestionState } from "./API";
import { GlobalStyle, Wrapper } from "./App.styles";

import QuestionCard from "./components/QuestionCard";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [difficulty, setDifficultly] = useState(Difficulty.EASY);

  console.log(difficulty);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, difficulty);

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      //users answer
      const answer = e.currentTarget.value;
      //check answer against correct answer
      const correct = questions[number].correct_answer === answer;
      //add score if correct
      if (correct) setScore((prev) => prev + 1);
      // save answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const easy = () => {
    setDifficultly(Difficulty.EASY);
  };

  const medium = () => {
    setDifficultly(Difficulty.MEDIUM);
  };

  const hard = () => {
    setDifficultly(Difficulty.HARD);
  };

  const nextQuestion = () => {
    //move to next question if not the last question
    const nextQuestion = number + 1;

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1> The Quiz </h1>

        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <div className="difficulty">
            {difficulty === "easy" ? (
              <h2>Easy</h2>
            ) : (
              <button className="easy" onClick={easy}>
                {" "}
                Easy
              </button>
            )}

            {difficulty === "medium" ? (
              <h2>Medium</h2>
            ) : (
              <button onClick={medium}> Medium</button>
            )}
            {difficulty === "hard" ? (
              <h2>HARD</h2>
            ) : (
              <button onClick={hard}> Hard</button>
            )}
          </div>
        ) : null}

        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <button className="start" onClick={startTrivia}>
            Start
          </button>
        ) : null}
        {!gameOver ? <p className="score"> Score: {score} </p> : null}
        {loading && <p> Loading Questions </p>}

        {!loading && !gameOver && (
          <QuestionCard
            questionNr={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver &&
        !loading &&
        userAnswers.length === number + 1 &&
        number !== TOTAL_QUESTIONS - 1 ? (
          <button className="next" onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
      </Wrapper>
    </>
  );
};

export default App;
