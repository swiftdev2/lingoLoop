import type { Selection } from "@nextui-org/react";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from "@nextui-org/react";
import { IconCheck, IconInfoSquareRoundedFilled } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";

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
  const [streak, setStreak] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [getGroups, setGetGroups] = useState<string[]>([]);
  const [showingSubsetGroup, setShowingSubsetGroup] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [reduced, setIsReduced] = useState(true);
  const [reducedWords, setIsReducedWords] = useState<wordsInterface[]>([]);
  const [getIncorrectWords, setIncorrectGetWords] = useState<
    incorrectWordsInterface[]
  >([]);
  const [currentWord, setCurrentWord] = useState<
    wordsInterface | incorrectWordsInterface
  >();
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  const fetchWithErrorHandling = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();

      return {
        error:
          errorData.error ||
          `Error fetching from ${url}: ${response.statusText}`,
      };
    } else {
      return response.json();
    }
  };

  const fetchData = async () => {
    const data = await fetchWithErrorHandling(
      "/api/getWords?fullList=false&groups=all",
    );

    if (!data || data.error) {
      setFetchError(data?.error || "Failed to fetch data");

      return;
    }

    setGetWords(data["words"]);
    setIncorrectGetWords(data["incorrectWords"]);

    const responseGroup = await fetch("/api/getGroups", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const dataGroup = ["All"];
    const dataGroup2: string[] = await responseGroup.json();
    const combinedArray = dataGroup.concat(dataGroup2);

    setGetGroups(combinedArray);
    setSelectedKeys(new Set([combinedArray[0]]));
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
  }, [currentWord]);

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "1" || event.key === " ") {
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

    if (!isWordsInterface(currentWord!) && showingSubsetGroup === false) {
      // increment incorrect word list
      const countPlus = currentWord!.count + 1;
      const response = await fetch(
        `/api/incrementIncorrectWord?id=${currentWord!.id}&count=${countPlus}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );
      const data = await response.json();

      setIncorrectGetWords(data);
    } else if (
      !isWordsInterface(currentWord!) &&
      reduced === true &&
      showingSubsetGroup === true
    ) {
      const countPlus = currentWord!.count + 1;

      if (countPlus === 3) {
        setIncorrectGetWords((prevWords) =>
          prevWords.filter((word) => word.id !== currentWord!.id),
        );
      } else {
        setIncorrectGetWords((prevWords) =>
          prevWords.map((word) =>
            word.id === currentWord!.id ? { ...word, count: countPlus } : word,
          ),
        );
      }
    }
    selectWord();
  };

  const handleWrongAnswer = async () => {
    setStreak(0);
    setShowAnswer(false);
    if (showingSubsetGroup === false) {
      if (incorrectWordInList()) {
        // add to incorrect word list
        // const response = await fetch(
        //   `/api/addIncorrectWord?id=${currentWord.id}`,
        // );

        const response = await fetch(
          `/api/addIncorrectWord?id=${currentWord!.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          },
        );
        const data = await response.json();

        setIncorrectGetWords(data);
      } else {
        // increment incorrect word list
        const response = await fetch(
          `/api/incrementIncorrectWord?id=${currentWord!.id}&count=0`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          },
        );
        const data = await response.json();

        setIncorrectGetWords(data);
      }
    } else if (reduced === true) {
      if (!incorrectWordInList()) {
        // add incorrect word
        const constructedIncorrectWord: incorrectWordsInterface = {
          id: currentWord!.id,
          english: currentWord!.english,
          translation: currentWord!.translation,
          wordGroups: currentWord!.wordGroups,
          created: currentWord!.created,
          count: 0,
        };

        setIncorrectGetWords((prevWords) => [
          ...prevWords,
          constructedIncorrectWord,
        ]);
      } else {
        console.log("wow2");
        // set count to 0
        setIncorrectGetWords((prevWords) =>
          prevWords.map(
            (word) =>
              word.id === currentWord!.id ? { ...word, count: 0 } : word, // Update count to 0 for the matching item
          ),
        );
      }
    }
    selectWord();
  };

  const incorrectWordInList = () => {
    let found = false;

    getIncorrectWords.map((word) => {
      if (word.id === currentWord!.id) {
        found = true;
      }
    });

    return found;
  };

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys],
  );

  async function selectWord() {
    if (getWords.length === 0) {
      return null;
    } else {
      if (streak > 14 && streak % 15 == 0 && showingSubsetGroup === false) {
        const response = await fetch("/api/streakShow", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        const data = await response.json();

        setGetWords(data);
      }

      if (
        streak > 14 &&
        streak % 15 == 0 &&
        reduced === true &&
        showingSubsetGroup === true
      ) {
        incrementReducedWords(getWords, reducedWords);
      }

      // 50% chance of showing incorrect word is > 4 in list
      // 25% chance of showing incorrect word is < 4 in list
      const multiplier = getIncorrectWords.length > 4 ? 2 : 4;
      const chanceOfFour = Math.floor(Math.random() * multiplier);

      // only pick from incorrect word list if there is anything in that list or using smart algorithm in subset group
      if (
        getIncorrectWords.length > 0 &&
        (showingSubsetGroup === false || reduced === true) &&
        chanceOfFour === 1
      ) {
        const randomIndex = Math.floor(
          Math.random() * getIncorrectWords.length,
        );
        const selectedWord = getIncorrectWords[randomIndex];

        setCurrentWord(selectedWord);
      } else {
        // const randomIndex = Math.floor(Math.random() * getWords.length);
        // Non biased random when smart algorithm off in subset
        const randomIndex =
          reduced === false && showingSubsetGroup === true
            ? Math.floor(Math.random() * getWords.length)
            : getBiasedRandomIndex();
        const selectedWord = getWords[randomIndex];

        setCurrentWord(selectedWord);
        console.log("selectedWord", selectedWord);
      }

      // show arabic word as Q 33% of time
      const chanceOfThree = Math.floor(Math.random() * 3);

      setShowAnswer(chanceOfThree == 1 ? true : false);
    }
  }

  // Function to generate a biased random index
  const getBiasedRandomIndex = (): number => {
    // < 1 = bias towards end, > 1 = bias towards start
    const exponent = 0.7;
    const randomValue = Math.random(); // Generates a number between 0 and 1
    const biasedValue = Math.pow(randomValue, exponent); // Skews the value to bias towards 1

    // Convert the biased value to an index between 0 and (length - 1)
    return Math.floor(biasedValue * getWords.length);
  };

  async function updateWords(reduced: boolean) {
    const dropdownValues = selectedKeys;
    const group = dropdownValues ? Array.from(dropdownValues).join(", ") : "";

    setShowingSubsetGroup(group.includes("All") ? false : true);
    const data = await fetchWithErrorHandling(
      `/api/getWords?fullList=false&groups=${group}`,
    );

    if (!data || data.error) {
      setFetchError(data?.error || "Failed to fetch data");

      return;
    }

    if (!group.includes("All") && reduced === true) {
      const shuffledWords = shuffleArray(data["words"]);

      setIsReducedWords(shuffledWords);
      setGetWords([]);
      setIncorrectGetWords([]);
      incrementReducedWords([], shuffledWords);
    } else if (group.includes("All")) {
      setGetWords(data["words"]);
      setIsReducedWords([]);
      setIncorrectGetWords(data["incorrectWords"]);
    } else {
      setGetWords(data["words"]);
      setIsReducedWords([]);
    }
  }

  function isWordsInterface(
    word: wordsInterface | incorrectWordsInterface,
  ): word is wordsInterface {
    return (word as wordsInterface).shown !== undefined;
  }

  const incrementReducedWords = (
    getWords: wordsInterface[],
    reducedWords: wordsInterface[],
  ) => {
    if (getWords.length !== reducedWords.length) {
      if (getWords.length + 5 < reducedWords.length) {
        for (let i = getWords.length; i <= getWords.length + 5; i++) {
          setGetWords((prevWords) => [...prevWords, reducedWords[i]]);
        }
      } else {
        for (let i = getWords.length; i < reducedWords.length; i++) {
          setGetWords((prevWords) => [...prevWords, reducedWords[i]]);
        }
      }
    }
  };

  const shuffleArray = (array: wordsInterface[]) => {
    const shuffledArray = [...array]; // Create a copy of the array to avoid mutating the original

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i

      // Swap elements at indices i and j
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }

    return shuffledArray; // Return the shuffled array
  };

  // console.log("getWords", getWords);
  // console.log("showingSubsetGroup", showingSubsetGroup);
  // console.log("getIncorrectWords", getIncorrectWords);
  // console.log("currentWord", currentWord);

  return (
    <>
      {getWords.length !== 0 ? (
        <>
          <div className="meta">
            <div>
              <p>Select groups to test on</p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Dropdown>
                  <DropdownTrigger>
                    <Button className="dropdown-button" variant="bordered">
                      {selectedValue}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Multiple selection example"
                    closeOnSelect={false}
                    selectedKeys={selectedKeys}
                    selectionMode="multiple"
                    variant="flat"
                    onSelectionChange={setSelectedKeys}
                  >
                    {getGroups
                      .sort((a, b) => a.localeCompare(b))
                      .map((group) => (
                        <DropdownItem key={group}>{group}</DropdownItem>
                      ))}
                  </DropdownMenu>
                </Dropdown>

                <Button
                  // isIconOnly
                  color="success"
                  endContent={<IconCheck />}
                  style={{ marginLeft: "0.5rem" }}
                  variant="flat"
                  onClick={() => {
                    updateWords(reduced);
                  }}
                />
              </div>
              {showingSubsetGroup && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "0.5rem",
                  }}
                >
                  <Checkbox
                    color="success"
                    isSelected={reduced}
                    onValueChange={(value) => {
                      setIsReduced(value);
                      updateWords(value);
                    }}
                  >
                    Use smart algorithm
                  </Checkbox>
                  <Tooltip
                    content={
                      <div className="px-1 py-2">
                        <div className="text-tiny">
                          Start with small number of words first, gradually add
                          more
                        </div>
                        <div className="text-tiny">
                          Show words you get wrong more often
                        </div>
                      </div>
                    }
                  >
                    <IconInfoSquareRoundedFilled
                      style={{ color: "#17c964", marginLeft: "0.3rem" }}
                    />
                  </Tooltip>
                </div>
              )}
            </div>
            <div className="chips-group">
              <Chip className="standard-chip" color="warning">
                Streak: {streak}
              </Chip>
              <Chip className="standard-chip" color="success">
                Words testing on: {getWords.length}
              </Chip>
              {(showingSubsetGroup === false || reduced) && (
                <Chip className="bottom-chip" color="secondary">
                  Incorrect words: {getIncorrectWords.length}
                </Chip>
              )}
            </div>
          </div>
          {currentWord && (
            <>
              <Divider className="block sm:hidden" />
              <h1 className="block sm:hidden">Question:</h1>
              <Card
                isPressable
                className="card question-card"
                radius="lg"
                onPress={() =>
                  setShowAnswer((prev) => (prev == false ? true : false))
                }
              >
                {!showAnswer ? (
                  <CardBody
                    style={{
                      fontSize:
                        currentWord.english.length > 10 ? "1.4rem" : "2rem",
                      alignItems: "center",
                    }}
                  >
                    {currentWord.english}
                  </CardBody>
                ) : (
                  <CardBody
                    style={{
                      fontSize:
                        currentWord.english.length > 10 ? "1.4rem" : "2rem",
                      alignItems: "center",
                    }}
                  >
                    {currentWord.translation}
                  </CardBody>
                )}

                <Divider />
                <CardFooter>
                  {!showAnswer ? <>English</> : <>Arabic</>}
                </CardFooter>
              </Card>
            </>
          )}
          <div className="card-container">
            <h1 className="block sm:hidden">
              Did you get the translation right?:
            </h1>
            <Card
              isPressable
              className="card correct-card"
              radius="lg"
              onPress={handleCorrectAnswer}
            >
              <CardBody className="card-body">Correct</CardBody>
            </Card>

            <Card
              isPressable
              className="card wrong-card"
              radius="lg"
              onPress={handleWrongAnswer}
            >
              <CardBody className="card-body">Wrong</CardBody>
            </Card>
          </div>
        </>
      ) : fetchError ? (
        <p>{fetchError}</p>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};
