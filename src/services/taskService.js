// src/services/taskService.js
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

const TASKS_COLLECTION = 'tasks';

export const taskService = {
  // Fetch all tasks for a specific user
  async getTasks(userId) {
    try {
      const tasksRef = collection(db, TASKS_COLLECTION);
      const q = query(
        tasksRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const tasks = [];
      
      querySnapshot.forEach((doc) => {
        tasks.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Add a new task
  async addTask(taskData) {
    try {
      const tasksRef = collection(db, TASKS_COLLECTION);
      const docRef = await addDoc(tasksRef, {
        ...taskData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return {
        id: docRef.id,
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  // Update an existing task
  async updateTask(taskId, updates) {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      return {
        id: taskId,
        ...updates,
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete a task
  async deleteTask(taskId) {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      await deleteDoc(taskRef);
      return taskId;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Toggle task completion
  async toggleTaskComplete(taskId, currentStatus) {
    try {
      return await this.updateTask(taskId, {
        completed: !currentStatus
      });
    } catch (error) {
      console.error('Error toggling task:', error);
      throw error;
    }
  }
};