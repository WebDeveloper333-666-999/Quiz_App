import React, { useState, useEffect } from "react";
import { create } from "zustand";
import { Alert, Button, Card, CardContent, Typography } from "@mui/material";

const useQuizStore = create((set) => ({
  score: 0,
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  decrementScore: () => set((state) => ({ score: state.score - 1 })),
  resetScore: () => set({ score: 0 }),
}));

const quizData = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome",  "Moscow"],
    answer: "Paris",
  },

  {
    question: "Which of the following is a PHP framework?",
    options: ["React", "Laravel", "ROR", "SpringBoot"],
    answer: "Laravel",
  },

  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris",
  },

  {
    question: "What is 5 + 3?",
    options: ["5", "8", "12", "15"],
    answer: "8",
  },

  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
  },
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showResultTag, setShowResultTag] = useState(null);
  const [timer, setTimer] = useState(60);
  const { score, incrementScore, decrementScore, resetScore } = useQuizStore();

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      decrementScore();
      nextQuestion();
    }
  }, [timer]);

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    if (option === quizData[currentQuestion].answer) {
      incrementScore();
      setShowResultTag(true); 
    } else {
      setShowResultTag(false);
    }

    setTimeout(nextQuestion, 1000);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimer(60);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimer(60);
    resetScore();
  };

  if (showResult) {
    return (
      <div className="text-center">
        <Typography variant="h4">Quiz Completed!</Typography>
        <Typography variant="h5">Your Score: {score}</Typography>
        <Button variant="contained" color="primary" onClick={restartQuiz} sx={{ mt: 2 }}>Restart Quiz</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <Typography variant="h4" gutterBottom>Quiz App</Typography>
      <Card sx={{ width: 400, p: 2, textAlign: 'center', margin: 'auto' }}>
        <Typography variant="h6">{quizData[currentQuestion].question}</Typography>
        <Typography variant="body2" color="text.secondary">Time left: {timer}s</Typography>

        {
          selectedAnswer && (showResultTag ? (
            <Alert severity={'success'}>Right</Alert>
          ) : (
            <Alert severity={'error'}>False</Alert> 
          ))
        }

        <CardContent>
          {quizData[currentQuestion].options.map((option) => (
            <Button
              key={option}
              variant="contained"
              fullWidth
              sx={{ mt: 1, bgcolor: selectedAnswer ? (option === quizData[currentQuestion].answer ? "green" : selectedAnswer === option ? "red" : "") : "primary" }}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer}
            >
              {option}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;
