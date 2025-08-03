import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CardProps {
  id: string;
  content: string;
  listId: string; // Nueva prop: el ID de la lista a la que pertenece la tarjeta
}

const Card: React.FC<CardProps> = ({ id, content, listId }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: id,
    data: {
      type: 'Task',
      containerId: listId, // Asociamos la tarjeta con el ID de su lista
    },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    border: isDragging ? '2px dashed #007bff' : '2px solid transparent',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-md p-3 shadow-sm hover:shadow-md cursor-grab transition-all duration-200 ease-in-out text-gray-800 break-words"
    >
      <p>{content}</p>
    </div>
  );
};

export default Card;