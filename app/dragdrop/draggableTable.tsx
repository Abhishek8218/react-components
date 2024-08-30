'use client'

import React, {  useRef } from 'react';
import type { DragEvent, TouchEvent } from 'react';


interface Row {
  id: string;
  content: string;
}

interface DraggableTableProps {
  rows: Row[];
  onDragStart: (row: Row) => void;
  onDragEnter: (index: number) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  hoveredIndex: number | null;
}

const DraggableTable: React.FC<DraggableTableProps> = ({
  rows,
  onDragStart,
  onDragEnter,
  onDrop,
  hoveredIndex,
  onDragEnd,
}) => {
  const dragItem = useRef<HTMLTableRowElement | null>(null);

  // Handle drag start event
  const handleDragStart = (e: DragEvent<HTMLTableRowElement>, row: Row) => {
    dragItem.current = e.currentTarget;
    onDragStart(row);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over event to allow dropping
  const handleDragOver = (e: DragEvent<HTMLTableElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop event
  const handleDrop = (e: DragEvent<HTMLTableElement>) => {
    e.preventDefault();
    onDrop();
  };

  // Handle touch start event
  const handleTouchStart = (e: TouchEvent<HTMLTableRowElement>, row: Row) => {
    e.preventDefault();
    const touch = e.touches[0];
    const dragEvent = new DragEvent('dragstart', {
      bubbles: true,
      cancelable: true,
      view: window,
      dataTransfer: new DataTransfer(),
    });
    if (dragEvent.dataTransfer) {
        dragEvent.dataTransfer.effectAllowed = 'move';
      }
    // dragEvent.dataTransfer.effectAllowed && dragEvent.dataTransfer.effectAllowed = 'move';
    dragItem.current = e.currentTarget;
    onDragStart(row);
    e.currentTarget.dispatchEvent(dragEvent);
  };

  // Handle touch move event
  const handleTouchMove = (e: TouchEvent<HTMLTableRowElement>) => {
    e.preventDefault();
  };

  // Handle touch end event
  const handleTouchEnd = (e: TouchEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    onDragEnd();
  };

  return (
    <div className="w-full max-w-md p-4 bg-gray-100 rounded-md shadow-md overflow-x-auto">
      <table
        className="min-w-full bg-white border border-gray-200"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <thead>
          <tr>
            <th className="p-2 md:p-4 border-b text-left text-xs md:text-base">ID</th>
            <th className="p-2 md:p-4 border-b text-left text-xs md:text-base">Contentedewds</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.id}
              draggable
              onDragStart={(e) => handleDragStart(e, row)}
              onDragEnter={() => onDragEnter(index)}


              onDragEnd={() => onDragEnd()}
              onDrop={(e) => handleDrop(e as unknown as  DragEvent<HTMLTableElement>)}
              onTouchStart={(e) => handleTouchStart(e, row)}
              onTouchMove={(e) => handleTouchMove(e)}
              onTouchEnd={(e) => handleTouchEnd(e)}
              className={`cursor-move bg-white hover:bg-gray-100 transition-transform duration-300 ease-in-out ${
                hoveredIndex === index ? 'transform scale-105 border-2 border-gray-800' : ''
              }`}
            >
              <td className="p-2 md:p-4 border-b text-xs md:text-base">{row.id}</td>
              <td className="p-2 md:p-4 border-b text-xs md:text-base">{row.content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DraggableTable;
