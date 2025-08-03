'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, DragStartEvent
} from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import List from '@/components/List';
import Card from '@/components/Card'; // Importamos Card para el DragOverlay
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Task {
  id: string;
  content: string;
}

interface ListData {
  id: string;
  title: string;
  tasks: Task[];
}

const initialLists: ListData[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      { id: '1', content: 'Task 1' },
      { id: '2', content: 'Task 2' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      { id: '3', content: 'Task 3' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      { id: '4', content: 'Task 4' },
    ],
  },
];

const LOCAL_STORAGE_KEY = 'trello-clone-lists';

const Board = () => {
  const [lists, setLists] = useState<ListData[]>(initialLists);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newListName, setNewListName] = useState('');
  const [showAddListInput, setShowAddListInput] = useState(false);

  // Load from localStorage only on client-side after initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLists = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedLists) {
        setLists(JSON.parse(savedLists));
      }
    }
  }, []); // Empty dependency array means this runs once on mount

  // Save to localStorage whenever lists change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lists));
    }
  }, [lists]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.id === over.id) {
      setActiveId(null);
      return;
    }

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === 'Task') {
      const activeContainerId = active.data.current?.sortable?.containerId;
      const overContainerId = over.data.current?.sortable?.containerId || over.id; // over.id could be list ID if over list background

      if (activeContainerId === overContainerId) {
        // Mover tarea dentro de la misma lista
        const currentList = lists.find(list => list.id === activeContainerId);
        if (currentList) {
          const oldIndex = currentList.tasks.findIndex(task => task.id === active.id);
          const newIndex = over.data.current?.sortable?.index !== undefined
            ? over.data.current.sortable.index
            : currentList.tasks.length;

          if (oldIndex !== -1 && newIndex !== -1) {
            setLists(prevLists =>
              prevLists.map(list =>
                list.id === activeContainerId
                  ? { ...list, tasks: arrayMove(list.tasks, oldIndex, newIndex) }
                  : list
              )
            );
          }
        }
      } else {
        // Mover tarea entre diferentes listas
        setLists(prevLists => {
          const newLists = [...prevLists];

          const activeListIndex = newLists.findIndex(list => list.id === activeContainerId);
          // Determine the over list ID correctly, it could be a list or a task's container
          const targetOverListId = overType === 'List' ? over.id : over.data.current?.sortable?.containerId;
          const overListIndex = newLists.findIndex(list => list.id === targetOverListId);

          if (activeListIndex === -1 || overListIndex === -1) return prevLists;

          const activeTaskIndex = newLists[activeListIndex].tasks.findIndex(task => task.id === active.id);
          if (activeTaskIndex === -1) return prevLists;

          const [movedTask] = newLists[activeListIndex].tasks.splice(activeTaskIndex, 1);

          const overTaskIndex = overType === 'Task' && over.data.current?.sortable?.index !== undefined
            ? over.data.current.sortable.index
            : newLists[overListIndex].tasks.length;
          
          newLists[overListIndex].tasks.splice(overTaskIndex, 0, movedTask);

          return newLists;
        });
      }
    } else if (activeType === 'List') {
      // Mover lista (columna)
      const oldIndex = lists.findIndex(list => list.id === active.id);
      
      let targetOverListId: string | null = null;
      let finalNewIndex: number = -1; // Usamos un nuevo nombre para evitar confusión con newIndex

      if (overType === 'List') {
        targetOverListId = over.id;
        // Si se suelta sobre otra lista, usamos su índice preciso en el contexto sortable horizontal.
        finalNewIndex = over.data.current?.sortable?.index !== undefined
          ? over.data.current.sortable.index
          : lists.findIndex(list => list.id === targetOverListId); // Fallback al índice calculado
      } else if (overType === 'Task') {
        // Si se suelta sobre una tarea, obtenemos el ID de la lista a la que pertenece esa tarea.
        targetOverListId = over.data.current?.sortable?.containerId || null;
        if (targetOverListId) {
          finalNewIndex = lists.findIndex(list => list.id === targetOverListId);
        }
      } else {
        // Fallback: si over.type es undefined, asumimos que es el ID de una lista (ej. soltar sobre el botón de añadir lista).
        targetOverListId = over.id;
        finalNewIndex = lists.findIndex(list => list.id === targetOverListId);
      }

      if (oldIndex !== -1 && finalNewIndex !== -1) {
        setLists((prevLists) => arrayMove(prevLists, oldIndex, finalNewIndex));
      } else {
      }
    }
    setActiveId(null);
  };

  const activeTask = activeId
    ? lists.flatMap(list => list.tasks).find(task => task.id === activeId)
    : null;
  
  const activeList = activeId
    ? lists.find(list => list.id === activeId)
    : null;

  const handleAddTask = (listId: string, content: string) => {
    setLists((prevLists) => {
      const newLists = prevLists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: [...list.tasks, { id: Date.now().toString(), content }],
          };
        }
        return list;
      });
      return newLists;
    });
  };

  const handleAddList = () => {
    if (newListName.trim() === '') {
      return;
    }
    const newList: ListData = {
      id: `list-${Date.now()}`,
      title: newListName.trim(),
      tasks: [],
    };
    setLists((prevLists) => [...prevLists, newList]);
    setNewListName('');
    setShowAddListInput(false);
  };

  const handleEditListTitle = (listId: string, newTitle: string) => {
    setLists((prevLists) => {
      return prevLists.map((list) =>
        list.id === listId ? { ...list, title: newTitle } : list
      );
    });
  };

  const handleDeleteList = (listId: string) => {
    setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
  };

  const handleEditTask = (listId: string, taskId: string, newContent: string) => {
    setLists((prevLists) => {
      const newLists = prevLists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.map((task) =>
              task.id === taskId ? { ...task, content: newContent } : task
            ),
          };
        }
        return list;
      });
      return newLists;
    });
  };

  const handleDeleteTask = (listId: string, taskId: string) => {
    setLists((prevLists) => {
      const newLists = prevLists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.filter((task) => task.id !== taskId),
          };
        }
        return list;
      });
      return newLists;
    });
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <div className="flex flex-col h-screen p-8">
        <h1 className="text-white text-4xl font-bold mb-8">My Trello Board</h1>
        <SortableContext items={lists.map(list => list.id)} strategy={horizontalListSortingStrategy}>
          <div className="flex-grow flex space-x-6 overflow-x-auto items-start">
            {lists.map((list) => (
              <List
                key={list.id}
                id={list.id}
                title={list.title}
                tasks={list.tasks}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onEditListTitle={handleEditListTitle}
                onDeleteList={handleDeleteList}
              />
            ))}
            {!showAddListInput ? (
              <Button
                onClick={() => setShowAddListInput(true)}
                className="flex-shrink-0 w-72 h-fit bg-white/20 text-white hover:bg-white/30 transition-colors duration-200"
              >
                + Add another list
              </Button>
            ) : (
              <div className="bg-gray-100 rounded-lg w-72 p-3 flex-shrink-0">
                <Input
                  placeholder="Enter list title..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddList();
                    }
                  }}
                  className="mb-2"
                />
                <div className="flex space-x-2">
                  <Button onClick={handleAddList}>Add list</Button>
                  <Button variant="ghost" onClick={() => setShowAddListInput(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
      <DragOverlay>
        {activeTask ? <Card id={activeTask.id} content={activeTask.content} /> : null}
        {activeList ? (
          <div className="bg-gray-100 rounded-lg w-72 p-4 flex-shrink-0 opacity-80 shadow-xl border border-blue-500 z-10"> {/* Added opacity, shadow-xl, border, z-10 */}
            <h2 className="font-semibold text-lg mb-4 text-gray-800">{activeList.title}</h2>
            {activeList.tasks.map((task) => (
              <Card key={task.id} id={task.id} content={task.content} listId={activeList.id} />
            ))}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Board;