'use client';

import React, { useState } from 'react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './strictModeDroppable'; // Import the new component

const Page: React.FC = () => {
  const [table1, setTable1] = useState([
    { id: '1', text: 'Row 1' },
    { id: '2', text: 'Row 2' },
    { id: '3', text: 'Row 3' },
  ]);

  const [table2, setTable2] = useState([
    { id: '4', text: 'Row 4' },
    { id: '5', text: 'Row 5' },
    { id: '6', text: 'Row 6' },
  ]);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return; // If dropped outside

    if (source.droppableId === destination.droppableId) {
      // Reorder within the same table
      const sourceList = source.droppableId === 'table1' ? [...table1] : [...table2];
      const [movedItem] = sourceList.splice(source.index, 1);
      sourceList.splice(destination.index, 0, movedItem);

      if (source.droppableId === 'table1') {
        setTable1(sourceList);
      } else {
        setTable2(sourceList);
      }
    } else {
      // Move between tables
      const sourceList = source.droppableId === 'table1' ? [...table1] : [...table2];
      const destinationList = destination.droppableId === 'table1' ? [...table1] : [...table2];

      const [movedItem] = sourceList.splice(source.index, 1);
      destinationList.splice(destination.index, 0, movedItem);

      setTable1(source.droppableId === 'table1' ? sourceList : destinationList);
      setTable2(destination.droppableId === 'table2' ? destinationList : sourceList);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 p-4">
        <StrictModeDroppable droppableId="table1">
          {(provided) => (
            <div
              className="bg-white shadow-lg rounded-lg p-4 flex-1"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <h3 className="text-xl font-semibold mb-4">Table 1</h3>
              <table className="min-w-full bg-gray-100 rounded-md">
                <tbody ref={provided.innerRef} {...provided.droppableProps}>
                  {table1.map((row, index) => (
                    <Draggable key={row.id} draggableId={row.id} index={index}>
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <td className="p-4 text-gray-800">{row.text}</td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              </table>
            </div>
          )}
        </StrictModeDroppable>

        <StrictModeDroppable droppableId="table2">
          {(provided) => (
            <div
              className="bg-white shadow-lg rounded-lg p-4 flex-1"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <h3 className="text-xl font-semibold mb-4">Table 2</h3>
              <table className="min-w-full bg-gray-100 rounded-md">
                <tbody ref={provided.innerRef} {...provided.droppableProps}>
                  {table2.map((row, index) => (
                    <Draggable key={row.id} draggableId={row.id} index={index}>
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <td className="p-4 text-gray-800">{row.text}</td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              </table>
            </div>
          )}
        </StrictModeDroppable>
      </div>
    </DragDropContext>
  );
};

export default Page;
