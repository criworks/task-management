import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Card from '@/components/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TaskModal from '@/components/TaskModal';

interface Task {
  id: string;
  content: string;
}

interface ListProps {
  id: string;
  title: string;
  tasks: Task[];
  onAddTask: (listId: string, content: string) => void;
  onEditTask: (listId: string, taskId: string, newContent: string) => void;
  onDeleteTask: (listId: string, taskId: string) => void;
  onEditListTitle: (listId: string, newTitle: string) => void;
  onDeleteList: (listId: string) => void;
}

const List: React.FC<ListProps> = ({
  id, title, tasks, onAddTask, onEditTask, onDeleteTask, onEditListTitle, onDeleteList
}) => {
  const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
    id: id,
  });

  const { attributes, listeners, setNodeRef: setSortableNodeRef, transform, transition, isDragging: isListDragging } = useSortable({
    id: id,
    data: {
      type: 'List',
      containerId: id, // Important for dnd-kit to know this is a container
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isListDragging ? 0.5 : 1,
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleOpenModal = (task?: Task) => {
    setCurrentTask(task || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };

  const handleSaveTask = (content: string) => {
    if (currentTask) {
      onEditTask(id, currentTask.id, content);
    } else {
      onAddTask(id, content);
    }
  };

  const handleDeleteTask = () => {
    if (currentTask) {
      onDeleteTask(id, currentTask.id);
      handleCloseModal();
    }
  };

  const handleTitleBlur = () => {
    if (newTitle.trim() !== '' && newTitle !== title) {
      onEditListTitle(id, newTitle);
    } else {
      setNewTitle(title); // Revert if empty or unchanged
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleTitleBlur();
    } else if (event.key === 'Escape') {
      setNewTitle(title); // Revert on escape
      setIsEditingTitle(false);
    }
  };

  return (
    <div
      ref={(node) => {
        setDroppableNodeRef(node);
        setSortableNodeRef(node);
      }}
      style={style}
      {...attributes}
      className={`bg-gray-100 rounded-lg w-72 p-4 flex-shrink-0 ${isOver ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="flex justify-between items-center mb-4" {...listeners}>
        {isEditingTitle ? (
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            autoFocus
            className="text-lg font-semibold bg-transparent focus:outline-none focus:ring-0 border-none px-0 py-0 h-auto"
          />
        ) : (
          <h2 className="font-semibold text-lg text-gray-800 cursor-pointer" onClick={() => setIsEditingTitle(true)}>{title}</h2>
        )}
        <Button variant="ghost" size="sm" onClick={() => onDeleteList(id)} className="ml-2">
          ✖
        </Button>
      </div>
      <SortableContext id={id} items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 mb-4 min-h-[50px]">
          {tasks.map((task) => (
            <div key={task.id} onClick={() => handleOpenModal(task)}>
              <Card id={task.id} content={task.content} listId={id} />
            </div>
          ))}
        </div>
      </SortableContext>
      <Button
        onClick={() => handleOpenModal()}
        className="w-full justify-start text-gray-600 hover:text-gray-900"
        variant="ghost"
      >
        + Add a card
      </Button>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        initialContent={currentTask?.content}
        isEditing={!!currentTask}
      />
    </div>
  );
};

export default List;