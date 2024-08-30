'use client';

import React, { useState } from 'react';
import DraggableTable from './draggableTable'; // Importing the separate table component

interface Row {
  id: string;
  content: string;
}

const initialRowsTable1: Row[] = [
  { id: '1', content: 'Item 1' },
  { id: '2', content: 'Item 2' },
  { id: '3', content: 'Item 3' },
    { id: '4', content: 'Item 4' },
];

const initialRowsTable2: Row[] = [
  { id: '5', content: 'Item 5' },
  { id: '6', content: 'Item 6' },
  { id: '7', content: 'Item 7' },
  { id: '8', content: 'Item 8' },
    
];

const DraggableTables: React.FC = () => {
    const [rowsTable1, setRowsTable1] = useState<Row[]>(initialRowsTable1);
    const [rowsTable2, setRowsTable2] = useState<Row[]>(initialRowsTable2);
    const [draggedItem, setDraggedItem] = useState<{ row: Row; fromTable: number } | null>(null);
    const [hoveredTable, setHoveredTable] = useState<number | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // Handle the start of dragging
    const handleDragStart = (row: Row, fromTable: number) => {
      setDraggedItem({ row, fromTable });
    };
  
    // Handle hover over a row
    const handleDragEnter = (toTable: number, index: number) => {
      if (!draggedItem) return;
  
      setHoveredTable(toTable);
      setHoveredIndex(index);
const sourceRows = draggedItem.fromTable === 1 ? rowsTable1 : rowsTable2;
      if (sourceRows.length === 1) {
        setErrorMessage('The tables cannot be empty!'); // Set error message
        handleDrop(); // Prevent the operation
        return; // Prevent the operation
      }else{
        setErrorMessage(null); // Clear the error message
      }
  
      const { row, fromTable } = draggedItem;
      if (fromTable === toTable) {
        // Rearrange within the same table
        const updatedRows = fromTable === 1 ? [...rowsTable1] : [...rowsTable2];
        updatedRows.splice(index, 0, updatedRows.splice(updatedRows.findIndex(r => r.id === row.id), 1)[0]);
        fromTable === 1 ? setRowsTable1(updatedRows) : setRowsTable2(updatedRows);
      } else {
        // Moving across tables
        const sourceRows = fromTable === 1 ? [...rowsTable1] : [...rowsTable2];
        const targetRows = toTable === 1 ? [...rowsTable1] : [...rowsTable2];
  
        sourceRows.splice(sourceRows.findIndex(r => r.id === row.id), 1);
        targetRows.splice(index, 0, row);
  
        fromTable === 1 ? setRowsTable1(sourceRows) : setRowsTable2(sourceRows);
        toTable === 1 ? setRowsTable1(targetRows) : setRowsTable2(targetRows);
  
        // Update drag item state
        setDraggedItem({ row, fromTable: toTable });
      }
    };
  
    // Handle the drop event
    const handleDrop = () => {
      setDraggedItem(null);
      setHoveredTable(null);
      setHoveredIndex(null);
    };

const handleDragEnd = () => {   
    console.log('drag end');

    setHoveredTable(null);
    setHoveredIndex(null);
    setDraggedItem(null);

    }


    return (
      <div className="flex flex-col justify-center gap-8 p-8">
          <div className="text-center text-2xl font-bold">Draggable Tables</div>
          <div className='flex flex-col sm:flex-row justify-center w-full'>
        <DraggableTable
          rows={rowsTable1}
          onDragStart={(row) => handleDragStart(row, 1)}
          onDragEnter={(index) => handleDragEnter(1, index)}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
         
          hoveredIndex={hoveredTable === 1 ? hoveredIndex : null}
        />
        <DraggableTable
          rows={rowsTable2}
          onDragStart={(row) => handleDragStart(row, 2)}
          onDragEnter={(index) => handleDragEnter(2, index)}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
         
          hoveredIndex={hoveredTable === 2 ? hoveredIndex : null}
        />
       
      </div>
      {errorMessage && (
        <div className=" text-xs mb-4 text-center text-red-500">{errorMessage}</div>
      )}
      </div>
    );
  };
  
  export default DraggableTables;