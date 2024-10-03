import { Card, CardBody, CardFooter, Chip, Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface wordsInterface {
  created: string;
  english: string;
  id: number;
  shown: number;
  translation: string;
  wordGroups: string;
}

interface incorrectWordsInterface {
  id: number;
  english: string;
  translation: string;
  wordGroups: string;
  created: string;
  count: number;
}

export const QuizWords = () => {
  const [getWords, setGetWords] = useState<wordsInterface[]>([]);
  const [getIncorrectWords, setIncorrectGetWords] = useState<
    incorrectWordsInterface[]
  >([]);
  const [streak, setStreak] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<
    wordsInterface | incorrectWordsInterface
  >();
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const fetchData = async () => {
    const response = await fetch("/api/getWords?fullList=false");
    const data = await response.json();

    setGetWords(data["words"]);
    setIncorrectGetWords(data["incorrectWords"]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    selectWord();
  }, [getWords]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "1") {
      setShowAnswer((prev) => (prev == false ? true : false));
    }

    if (event.key === "2") {
      handleCorrectAnswer();
    }

    if (event.key === "3") {
      handleWrongAnswer();
    }
  };

  const handleCorrectAnswer = async () => {
    setStreak((prev) => prev + 1);
    setShowAnswer(false);

    if (!isWordsInterface(currentWord!)) {
      // increment incorrect word list
      const countPlus = currentWord!.count + 1;
      const response = await fetch(
        `/api/incrementIncorrectWord?id=${currentWord!.id}&count=${countPlus}`,
      );
      const data = await response.json();

      setIncorrectGetWords(data);
    }
    selectWord();
  };

  const handleWrongAnswer = async () => {
    setStreak(0);
    setShowAnswer(false);
    if (isWordsInterface(currentWord!)) {
      // add to incorrect word list
      const response = await fetch(
        `/api/addIncorrectWord?id=${currentWord.id}`,
      );
      const data = await response.json();

      setIncorrectGetWords(data);
    } else {
      // increment incorrect word list
      const countPlus = currentWord!.count + 1;
      const response = await fetch(
        `/api/incrementIncorrectWord?id=${currentWord!.id}&count=0`,
      );
      const data = await response.json();

      setIncorrectGetWords(data);
    }
    selectWord();
  };

  async function selectWord() {
    if (getWords.length === 0) {
      return null;
    } else {
      // Pick from incorrect word list?
      if (streak > 14 && streak % 15 == 0) {
        console.log("wowstreak");
        const response = await fetch("/api/streakShow");
        const data = await response.json();

        setGetWords(data);
      }

      const chanceOfFour = Math.floor(Math.random() * 4);

      if (chanceOfFour === 1) {
        const randomIndex = Math.floor(
          Math.random() * getIncorrectWords.length,
        );
        const selectedWord = getIncorrectWords[randomIndex];

        setCurrentWord(selectedWord);
        console.log("chnace of 4 selectedWord", selectedWord);
      } else {
        const randomIndex = Math.floor(Math.random() * getWords.length);
        const selectedWord = getWords[randomIndex];

        setCurrentWord(selectedWord);
        console.log("selectedWord", selectedWord);
      }
    }
  }

  function isWordsInterface(
    word: wordsInterface | incorrectWordsInterface,
  ): word is wordsInterface {
    return (word as wordsInterface).shown !== undefined;
  }

  return (
    <>
      <div style={{ paddingBottom: "4rem" }} />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <Chip color="warning">Streak: {streak}</Chip>
      </div>
      {currentWord && (
        <Card
          isPressable
          className="min-w-[400px]"
          radius="lg"
          style={{ backgroundColor: "#0a10c9", padding: "2rem" }}
          onPress={() =>
            setShowAnswer((prev) => (prev == false ? true : false))
          }
        >
          {!showAnswer ? (
            <CardBody style={{ fontSize: "2rem", alignItems: "center" }}>
              {currentWord.english}
            </CardBody>
          ) : (
            <CardBody style={{ fontSize: "2rem", alignItems: "center" }}>
              {currentWord.translation}
            </CardBody>
          )}

          <Divider />
          <CardFooter>{!showAnswer ? <>English</> : <>Arabic</>}</CardFooter>
        </Card>
      )}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "centre",
          paddingTop: "4rem",
        }}
      >
        <Card
          isPressable
          className="min-w-[400px]"
          radius="lg"
          style={{
            backgroundColor: "green",
            padding: "4rem",
            marginRight: "5rem",
          }}
          onPress={handleCorrectAnswer}
        >
          <CardBody style={{ fontSize: "2rem", alignItems: "center" }}>
            Correct
          </CardBody>
        </Card>

        <Card
          isPressable
          className="min-w-[400px]"
          radius="lg"
          style={{ backgroundColor: "red", padding: "4rem" }}
          onPress={handleWrongAnswer}
        >
          <CardBody style={{ fontSize: "2rem", alignItems: "center" }}>
            wrong
          </CardBody>
        </Card>
      </div>
    </>
  );
};
