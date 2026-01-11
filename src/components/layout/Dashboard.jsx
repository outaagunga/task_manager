// src/components/layout/Dashboard.jsx
import React from 'react'; 
import Navbar from '../layout/NavBar';
import TaskForm from '../tasks/TaskForm';
import TaskList from '../tasks/TaskList';
import { TaskProvider } from '../../contexts/TaskContext';

export default function Dashboard() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your daily tasks efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task Form - Left Column */}
            <div className="lg:col-span-1">
              <TaskForm />
            </div>

            {/* Task List - Right Column */}
            <div className="lg:col-span-2">
              <TaskList />
            </div>
          </div>
        </main>
      </div>
    </TaskProvider>
  );
}