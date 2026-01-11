// src/components/tasks/TaskItem.jsx
import { useState } from 'react';
import { useTask } from '../../contexts/TaskContext';
import React from 'react'; 

export default function TaskItem({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState(task.priority || 'medium');

  const { updateTask, deleteTask, toggleTaskComplete } = useTask();

  const handleToggleComplete = async () => {
    try {
      await toggleTaskComplete(task.id);
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!editTitle.trim()) {
      alert('Task title cannot be empty');
      return;
    }

    try {
      await updateTask(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority || 'medium');
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <form onSubmit={handleUpdate} className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Task title"
          />
          
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Task description"
            rows="2"
          />

          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-all ${
      task.completed ? 'opacity-60' : ''
    }`}>
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={task.completed || false}
          onChange={handleToggleComplete}
          className="mt-1 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
        />
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-medium text-gray-900 ${
            task.completed ? 'line-through' : ''
          }`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={`mt-1 text-sm text-gray-600 ${
              task.completed ? 'line-through' : ''
            }`}>
              {task.description}
            </p>
          )}
          
          <div className="mt-2 flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              getPriorityColor(task.priority)
            }`}>
              {task.priority || 'medium'}
            </span>
            
            {task.createdAt && (
              <span className="text-xs text-gray-500">
                {new Date(task.createdAt.seconds * 1000 || task.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
            title="Edit task"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 focus:outline-none"
            title="Delete task"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}