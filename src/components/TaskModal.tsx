import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  onDelete?: () => void; // Nueva prop para eliminar
  initialContent?: string;
  isEditing: boolean; // Nueva prop para saber si estamos editando o creando
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen, onClose, onSave, onDelete, initialContent, isEditing
}) => {
  const [content, setContent] = useState(initialContent || '');

  useEffect(() => {
    if (isOpen) {
      setContent(initialContent || '');
    }
  }, [isOpen, initialContent]);

  const handleSubmit = () => {
    onSave(content);
    setContent('');
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Content
            </Label>
            <Input
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          {isEditing && (
            <Button variant="destructive" onClick={handleDelete}>
              Delete Task
            </Button>
          )}
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;