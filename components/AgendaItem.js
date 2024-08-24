import React from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, TrashIcon } from '@heroicons/react/24/outline';

const AgendaItem = ({ item, index, startTimer, removeItem, isActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex justify-between items-center"
    >
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Duration: {item.duration} minutes | Time Left: {item.timeLeft} minutes
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => startTimer(index)}
          disabled={isActive !== null}
          className={`btn ${
            isActive ? 'bg-green-500 text-white' : 'btn-primary'
          }`}
        >
          <ClockIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => removeItem(item.id)}
          className="btn bg-red-500 text-white hover:bg-red-600"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default AgendaItem;