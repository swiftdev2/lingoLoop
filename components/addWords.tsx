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
} from "@nextui-org/react";
import { IconPlus } from "@tabler/icons-react";
import React from "react";

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
  const [tableRows, setTableRows] = useState<TableRow[]>([]);
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
    const responseWords = await fetch("/api/getWords?fullList=true&groups=all");
    const dataWords = await responseWords.json();

    setGetWords(dataWords);

    const responseGroup = await fetch("/api/getGroups");
    const dataGroup = await responseGroup.json();

    setGetGroups(dataGroup);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTableRows([]);
    const newRows = getWords.map((item) => ({
      key: item.id as number,
      word: item.english as string,
      translation: item.translation as string,
      wordGroups: item.wordGroups as string[],
    }));

    setTableRows((prevRows) => [...prevRows, ...newRows]);
  }, [getWords]);

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
    // console.log(selectedKeys);
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

  const handleSubmitWords = async (inputValues: InputValue[]) => {
    const response = await fetch("/api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      key: "word",
      label: "WORD",
    },
    {
      key: "translation",
      label: "TRANSLATION",
    },
    {
      key: "wordGroups",
      label: "WORDGROUPS",
    },
  ];

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          {/* <Input
                isClearable
                classNames={{
                  base: "w-full sm:max-w-[44%]",
                  inputWrapper: "border-1",
                }}
                placeholder="Search by name..."
                size="sm"
                startContent={<SearchIcon className="text-default-300" />}
                value={filterValue}
                variant="bordered"
                onClear={() => setFilterValue("")}
                onValueChange={onSearchChange}
              /> */}
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
        </TableHeader>
        <TableBody items={tableRows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
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
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "centre",
                      }}
                    >
                      <Input
                        autoFocus
                        id={`eng-${index}`}
                        label="English Word"
                        //   placeholder="Enter the word in english"
                        variant="bordered"
                      />
                      <Input
                        id={`translation-${index}`}
                        label="Translation"
                        //   placeholder="Enter the word in arabic"
                        variant="bordered"
                      />
                      {/* <Input
                      id={`group-${index}`}
                      label="Group"
                      //   placeholder="Specify a group to associate with"
                      variant="bordered"
                    /> */}
                      {/* <Autocomplete className="max-w-xs" label="Select a Group">
                      {getGroups.map((group) => (
                        <AutocompleteItem key={group} value={group}>
                          {group}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete> */}

                      <Dropdown>
                        <DropdownTrigger className="min-w-[200px]">
                          <Button className="capitalize" variant="bordered">
                            {selectedKeys[dropdownId]
                              ? Array.from(selectedKeys[dropdownId])
                                  .join(", ")
                                  .replaceAll("_", " ")
                              : `Select Group `}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          disallowEmptySelection
                          aria-label={`Multiple selection for Dropdown ${index + 1}`}
                          className="min-w-[600px]"
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
                          {getGroups.map((group) => (
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
                    Add new word
                  </Button>
                  <Button
                    color="danger"
                    onPress={() =>
                      setNumOfRows((prev: number) =>
                        prev > 1 ? prev - 1 : prev,
                      )
                    }
                  >
                    Delete last row
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onCloseWords}>
                  Close
                </Button>
                <Button color="primary" onPress={handleAddWords}>
                  Add
                </Button>
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
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "centre",
                    }}
                  >
                    <Input
                      autoFocus
                      id={`group-${index}`}
                      label="Group Name"
                      variant="bordered"
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
                    Add new Group
                  </Button>
                  <Button
                    color="danger"
                    onPress={() =>
                      setNumOfRows((prev: number) =>
                        prev > 1 ? prev - 1 : prev,
                      )
                    }
                  >
                    Delete last row
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleAddGroups}>
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
