// src/contexts/TaskContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import React from 'react'; 
import { useAuth } from './AuthContext';
import { taskService } from '../services/taskService';

const TaskContext = createContext({});

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks when user logs in
  const fetchTasks = useCallback(async () => {
    if (!currentUser) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await taskService.getTasks(currentUser.uid);
      setTasks(fetchedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Load tasks on mount and when user changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Add task with optimistic UI
  const addTask = async (taskData) => {
    if (!currentUser) {
      throw new Error('User must be authenticated');
    }

    // Generate temporary ID for optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticTask = {
      id: tempId,
      ...taskData,
      userId: currentUser.uid,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Optimistic update - add immediately to UI
    setTasks(prevTasks => [optimisticTask, ...prevTasks]);

    try {
      // Perform actual Firebase operation
      const newTask = await taskService.addTask({
        ...taskData,
        userId: currentUser.uid,
        completed: false
      });

      // Replace optimistic task with real task
      setTasks(prevTasks =>
        prevTasks.map(task => task.id === tempId ? newTask : task)
      );

      return newTask;
    } catch (err) {
      // Rollback on error - remove optimistic task
      setTasks(prevTasks => prevTasks.filter(task => task.id !== tempId));
      setError(err.message);
      throw err;
    }
  };

  // Update task with optimistic UI
  const updateTask = async (taskId, updates) => {
    // Store original task for rollback
    const originalTask = tasks.find(task => task.id === taskId);
    if (!originalTask) return;

    // Optimistic update
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );

    try {
      await taskService.updateTask(taskId, updates);
    } catch (err) {
      // Rollback on error
      setTasks(prevTasks =>
        prevTasks.map(task => task.id === taskId ? originalTask : task)
      );
      setError(err.message);
      throw err;
    }
  };

  // Delete task with optimistic UI
  const deleteTask = async (taskId) => {
    // Store original task for rollback
    const originalTask = tasks.find(task => task.id === taskId);
    if (!originalTask) return;

    // Optimistic update - remove immediately
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

    try {
      await taskService.deleteTask(taskId);
    } catch (err) {
      // Rollback on error - restore task
      setTasks(prevTasks => [...prevTasks, originalTask]);
      setError(err.message);
      throw err;
    }
  };

  // Toggle task completion
  const toggleTaskComplete = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    await updateTask(taskId, { completed: !task.completed });
  };

  const value = {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    refreshTasks: fetchTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};