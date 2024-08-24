import React from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';

const AgendaItem = ({ item, index, startTimer, removeItem, isActive, isDone }) => {
  const minutes = Math.floor(item.timeLeft / 60);
  const seconds = item.timeLeft % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center ${isDone ? 'opacity-50' : ''}`}
    >
      <div className="flex-grow mb-2 sm:mb-0">
        <h3 className={`text-lg font-semibold ${isDone ? 'line-through' : ''} text-gray-800 dark:text-white`}>{item.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Duration: {item.duration} minutes | Time Left: {minutes}:{seconds.toString().padStart(2, '0')}
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => startTimer(index)}
          disabled={isActive || isDone}
          className={`btn px-3 py-2 ${
            isActive ? 'bg-green-500 text-white' : isDone ? 'bg-gray-400 text-white' : 'btn-primary'
          }`}
        >
          {isDone ? <CheckIcon className="h-5 w-5" /> : <ClockIcon className="h-5 w-5" />}
        </button>
        <button
          onClick={() => removeItem(item.id)}
          className="btn px-3 py-2 bg-red-500 text-white hover:bg-red-600"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default AgendaItem;