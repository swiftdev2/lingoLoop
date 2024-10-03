import { useEffect, useState } from 'react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Button, ModalFooter, ModalBody, ModalContent, Modal, ModalHeader, useDisclosure, Input} from "@nextui-org/react";
import {IconPlus} from '@tabler/icons-react';
import React from 'react';

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
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [numOfRows, setNumOfRows] = useState<number>(1);
    const [tableRows, setTableRows] = useState<TableRow[]>([]);

    const fetchData = async () => {
        const response = await fetch('/api/getWords?fullList=true');
        const data = await response.json();
        setGetWords(data);
    };
      
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
      setTableRows([])
      const newRows = getWords.map((item) => ({
        key: item.id as number,
        word: item.english as string,
        translation: item.translation as string,
        wordGroups: item.wordGroups as string[],
      }));
  
      setTableRows((prevRows) => [...prevRows, ...newRows]);
    }, [getWords]);

    const handleOpen = () => {
      setNumOfRows(1);
      onOpen();
    }

    const handleAdd = () => {
      onClose()
      const inputValues: InputValue[] = [];
  
      for (let index = 0; index < numOfRows; index++) {
        const englishWord = (document.getElementById(`eng-${index}`) as HTMLInputElement)?.value || '';
        const translation = (document.getElementById(`translation-${index}`) as HTMLInputElement)?.value || '';
        const group = (document.getElementById(`group-${index}`) as HTMLInputElement)?.value || '';
  
        inputValues.push({
          englishWord,
          translation,
          group,
        });
      }
  
      console.log('Input Values:', inputValues);
      inputValues.map((item) => {
        console.log(item["englishWord"])
      })

      handleSubmit(inputValues);
    };
  
      
    const handleSubmit = async (inputValues: InputValue[]) => {
        const response = await fetch('/api/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputValues),
        });

        if (response.ok) {
            const data = await response.json();
        } else {
            console.error('Error adding word');
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
                  onPress={() => handleOpen()}
                >
                  Add New
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-default-400 text-small">Total {getWords.length} words</span>
            </div>
          </div>
        );
      }, [
        getWords,
      ]);

    return (
        <>
        <Table aria-label="Example table with dynamic content" topContent={topContent}>
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={tableRows}>
            {(item) => (
                <TableRow key={item.key}>
                    {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                </TableRow>
            )}
            </TableBody>
        </Table>

        <Modal 
        size={"3xl"} 
        isOpen={isOpen} 
        onClose={onClose} 
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
              {Array.from({ length: numOfRows }, (_, index) => (
                <div style={{display: "flex", gap: "1rem", alignItems: "centre"}}>
                <Input
                  id={`eng-${index}`} 
                  autoFocus
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
                <Input
                  id={`group-${index}`} 
                  label="Group"
                //   placeholder="Specify a group to associate with"
                  variant="bordered"
                />
                </div>
              ))}
                <div style={{display: "flex", gap: "1rem", alignItems: "centre"}}>
                  <Button color="primary" onPress={() => setNumOfRows((prev: number) => prev + 1)}>
                    Add new word
                  </Button>
                  <Button color="danger" onPress={() => setNumOfRows((prev: number) => prev > 1 ? prev - 1 : prev)}>
                    Delete last row
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleAdd}>
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
