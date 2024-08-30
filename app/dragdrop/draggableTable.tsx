import React, { DragEvent } from 'react';

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

const DraggableTable: React.FC<DraggableTableProps> = ({ rows, onDragStart, onDragEnter, onDrop, hoveredIndex, onDragEnd }) => {
  // Handle drag start event
  const handleDragStart = (e: DragEvent<HTMLTableRowElement>, row: Row) => {
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
            <th className="p-2 md:p-4 border-b text-left text-xs md:text-base">Content</th>
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
