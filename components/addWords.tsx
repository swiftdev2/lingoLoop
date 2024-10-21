import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Button,
  ModalFooter,
  ModalBody,
  ModalContent,
  Modal,
  ModalHeader,
  useDisclosure,
  Input,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Dropdown,
  Tooltip,
} from "@nextui-org/react";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import React from "react";
import Cookies from "js-cookie";

interface InputValue {
  englishWord: string;
  translation: string;
  group: string;
}

interface TableRow {
  key: number;
  word: string;
  translation: string;
  wordGroups: string[];
}

export const AddWordsForm = () => {
  const [getWords, setGetWords] = useState<any[]>([]);
  const [getGroups, setGetGroups] = useState<string[]>([]);
  const [numOfRows, setNumOfRows] = useState<number>(1);
  const [incompleteForm, setIncompleteForm] = useState(false);
  const {
    isOpen: isOpenWords,
    onOpen: onOpenWords,
    onClose: onCloseWords,
  } = useDisclosure();
  const {
    isOpen: isOpenGroups,
    onOpen: onOpenGroups,
    onClose: onCloseGroups,
  } = useDisclosure();
  const [selectedKeys, setSelectedKeys] = useState<{
    [key: string]: Iterable<string> | "all" | undefined;
  }>({});

  const fetchData = async () => {
    // const responseWords = await fetch("/api/getWords?fullList=true&groups=all");
    const responseWords = await fetch(
      "/api/getWords?fullList=true&groups=all",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      },
    );
    const dataWords = await responseWords.json();

    setGetWords(dataWords);

    const responseGroup = await fetch("/api/getGroups", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const dataGroup = await responseGroup.json();

    setGetGroups(dataGroup);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    requiredWordFieldsNotComplete();
  }, [numOfRows]);

  const handleOpenNewWord = () => {
    setNumOfRows(1);
    setSelectedKeys({});
    onOpenWords();
  };

  const handleOpenNewGroup = () => {
    setNumOfRows(1);
    onOpenGroups();
  };

  // Handle selection change for a specific dropdown identified by dropdownId
  const handleSelectionChange = (
    dropdownId: string,
    keys: Iterable<string>,
  ) => {
    setSelectedKeys((prevSelected) => ({
      ...prevSelected,
      [dropdownId]: keys,
    }));
  };

  const handleDeleteWord = async (deleteId: number, word: string) => {
    console.log(deleteId);
    const response = await fetch(`/api/deleteWord?id=${deleteId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    if (response.ok) {
      alert(`Word: ${word} deleted successfully`);
      const dataWords = await response.json();

      setGetWords(dataWords);
    } else {
      alert(`An unknow error occured, word: ${word} deleted unsuccessfully`);
    }
  };

  const handleAddWords = () => {
    onCloseWords();
    const inputValues: InputValue[] = [];

    for (let index = 0; index < numOfRows; index++) {
      const englishWord =
        (document.getElementById(`eng-${index}`) as HTMLInputElement)?.value ||
        "";
      const translation =
        (document.getElementById(`translation-${index}`) as HTMLInputElement)
          ?.value || "";

      const dropdownValues = selectedKeys[`dropdown-${index}`];
      const group = dropdownValues ? Array.from(dropdownValues).join(", ") : "";

      console.log(selectedKeys[`dropdown-${index}`]);
      inputValues.push({
        englishWord,
        translation,
        group,
      });
    }
    handleSubmitWords(inputValues);
  };

  const handleAddGroups = () => {
    onCloseGroups();
    const inputValues = [];

    for (let index = 0; index < numOfRows; index++) {
      const group =
        (document.getElementById(`group-${index}`) as HTMLInputElement)
          ?.value || "";

      inputValues.push(group);
    }

    console.log(inputValues);

    handleSubmitGroups(inputValues);
  };

  const requiredWordFieldsNotComplete = () => {
    for (let index = 0; index < numOfRows; index++) {
      if (
        (document.getElementById(`eng-${index}`) as HTMLInputElement)?.value ===
        ""
      ) {
        setIncompleteForm(true);

        return;
      }
      if (
        (document.getElementById(`translation-${index}`) as HTMLInputElement)
          ?.value === ""
      ) {
        setIncompleteForm(true);

        return;
      }
    }
    setIncompleteForm(false);
  };

  const requiredGroupFieldsNotComplete = () => {
    console.log("wowza");
    for (let index = 0; index < numOfRows; index++) {
      if (
        (document.getElementById(`group-${index}`) as HTMLInputElement)
          ?.value === ""
      ) {
        setIncompleteForm(true);

        return;
      }
    }
    console.log("goteer");
    setIncompleteForm(false);
  };

  const handleSubmitWords = async (inputValues: InputValue[]) => {
    const response = await fetch("/api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(inputValues),
    });

    if (response.ok) {
      const data = await response.json();

      setGetWords(data);
    } else {
      console.error("Error adding word");
    }
  };

  const handleSubmitGroups = async (inputValues: string[]) => {
    const response = await fetch("/api/addGroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(inputValues),
    });

    if (response.ok) {
      const data = await response.json();

      setGetGroups(data);
    } else {
      console.error("Error adding word");
    }
  };

  const columns = [
    {
      key: "english",
      label: "WORD",
    },
    {
      key: "translation",
      label: "TRANSLATION",
    },
    {
      key: "wordgroups",
      label: "WORDGROUPS",
    },
    {
      key: "shown",
      label: "in word list?",
    },
    {
      key: "actions",
      label: "actions",
    },
  ];

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <div className="flex gap-3">
            <Button
              className="bg-foreground text-background"
              endContent={<IconPlus />}
              size="sm"
              onPress={() => handleOpenNewWord()}
            >
              Add New Word
            </Button>
          </div>
          <div className="flex gap-3">
            <Button
              className="bg-foreground text-background"
              endContent={<IconPlus />}
              size="sm"
              onPress={() => handleOpenNewGroup()}
            >
              Add New Group
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {getWords.length} words
          </span>
        </div>
      </div>
    );
  }, [getWords]);

  console.log("getWords", getWords);
  console.log("getGroups", getGroups);

  return (
    <>
      <Table
        aria-label="Example table with dynamic content"
        topContent={topContent}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
          {/* <TableColumn key="actions">Actions</TableColumn> */}
        </TableHeader>
        <TableBody items={getWords}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell key={`${item.key}-${columnKey}`}>
                  {columnKey === "actions" ? (
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      onPress={() => handleDeleteWord(item.id, item.english)}
                    >
                      <IconTrash style={{ maxHeight: "1.5rem" }} />
                    </Button>
                  ) : (
                    getKeyValue(item, columnKey) // Display static value
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        isDismissable={false}
        isOpen={isOpenWords}
        size={"4xl"}
        onClose={onCloseWords}
      >
        <ModalContent>
          {(onCloseWords) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Words
              </ModalHeader>
              <ModalBody>
                {Array.from({ length: numOfRows }, (_, index) => {
                  const dropdownId = `dropdown-${index}`;

                  return (
                    <div
                      key={`${index}-epicdiv`}
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "centre",
                      }}
                    >
                      <Input
                        // autoFocus
                        id={`eng-${index}`}
                        label="English Word"
                        variant="bordered"
                        onBlur={requiredWordFieldsNotComplete}
                      />
                      <Input
                        id={`translation-${index}`}
                        label="Translation"
                        variant="bordered"
                        onBlur={requiredWordFieldsNotComplete}
                        onChange={requiredWordFieldsNotComplete}
                      />

                      <Dropdown>
                        <DropdownTrigger className="min-w-[13rem] min-h-[3.5rem]">
                          <Button className="capitalize" variant="bordered">
                            {/* {selectedKeys[dropdownId]
                              ? Array.from(selectedKeys[dropdownId])
                                  .join(", ")
                                  .replaceAll("_", " ")
                              : `Select Group `} */}
                            {selectedKeys[dropdownId]
                              ? typeof selectedKeys[dropdownId] === "string" &&
                                selectedKeys[dropdownId] === "all"
                                ? `All selected`
                                : Array.from(selectedKeys[dropdownId] || [])
                                    .join(", ")
                                    .replaceAll("_", " ")
                              : `Select Group `}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          // disallowEmptySelection
                          aria-label={`Multiple selection for Dropdown ${index + 1}`}
                          // className="min-w-[3rem]"
                          closeOnSelect={false}
                          selectedKeys={selectedKeys[dropdownId]}
                          selectionMode="multiple"
                          variant="flat"
                          onSelectionChange={(keys) =>
                            handleSelectionChange(
                              dropdownId,
                              Array.from(keys).map((key) => key.toString()),
                            )
                          }
                        >
                          {getGroups
                            .sort((a, b) => a.localeCompare(b))
                            .map((group) => (
                              <DropdownItem key={group}>{group}</DropdownItem>
                            ))}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  );
                })}
                <div
                  style={{ display: "flex", gap: "1rem", alignItems: "centre" }}
                >
                  <Button
                    color="primary"
                    onPress={() => setNumOfRows((prev: number) => prev + 1)}
                  >
                    Add another word
                  </Button>
                  {numOfRows > 1 && (
                    <Button
                      color="danger"
                      onPress={() => setNumOfRows((prev: number) => prev - 1)}
                    >
                      Delete last word
                    </Button>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onCloseWords}>
                  Discard
                </Button>

                <Tooltip
                  content="Please ensure all words and their translations have been entered"
                  isDisabled={!incompleteForm}
                >
                  <span>
                    <Button
                      color="primary"
                      isDisabled={incompleteForm}
                      onPress={handleAddWords}
                    >
                      Save
                    </Button>
                  </span>
                </Tooltip>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isDismissable={false}
        isOpen={isOpenGroups}
        size={"3xl"}
        onClose={onCloseGroups}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Groups
              </ModalHeader>
              <ModalBody>
                {Array.from({ length: numOfRows }, (_, index) => (
                  <div
                    key={`${index}-epicdiv`}
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "centre",
                    }}
                  >
                    <Input
                      // autoFocus
                      id={`group-${index}`}
                      label="Group Name"
                      variant="bordered"
                      onBlur={requiredGroupFieldsNotComplete}
                    />
                  </div>
                ))}
                <div
                  style={{ display: "flex", gap: "1rem", alignItems: "centre" }}
                >
                  <Button
                    color="primary"
                    onPress={() => setNumOfRows((prev: number) => prev + 1)}
                  >
                    Add another Group
                  </Button>
                  {numOfRows > 1 && (
                    <Button
                      color="danger"
                      onPress={() => setNumOfRows((prev: number) => prev - 1)}
                    >
                      Delete last group
                    </Button>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Discard
                </Button>
                <Tooltip
                  content="Please ensure all words and their translations have been entered"
                  isDisabled={!incompleteForm}
                >
                  <span>
                    <Button
                      color="primary"
                      isDisabled={incompleteForm}
                      onPress={handleAddGroups}
                    >
                      Save
                    </Button>
                  </span>
                </Tooltip>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
