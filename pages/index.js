import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AnimatePresence, motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { Howl } from 'howler';
import { PlusIcon, DocumentIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import AgendaItem from '../components/AgendaItem';
import TimePicker from '../components/TimePicker';

export default function Home() {
  const [agendaItems, setAgendaItems] = useState([]);
  const [currentItem, setCurrentItem] = useState('');
  const [currentTime, setCurrentTime] = useState(15); // Default to 15 minutes
  const [activeIndex, setActiveIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('agendaItems') || '[]');
    setAgendaItems(savedItems);
    setDarkMode(localStorage.getItem('darkMode') === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('agendaItems', JSON.stringify(agendaItems));
  }, [agendaItems]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addItem = () => {
    if (currentItem && currentTime > 0) {
      const newItem = {
        id: Date.now(),
        title: currentItem,
        duration: currentTime,
        timeLeft: currentTime
      };
      setAgendaItems([...agendaItems, newItem]);
      setCurrentItem('');
      setCurrentTime(15); // Reset to default 15 minutes
    }
  };

  const removeItem = (id) => {
    setAgendaItems(agendaItems.filter(item => item.id !== id));
  };

  const startTimer = (index) => {
    if (activeIndex !== null) return;
    setActiveIndex(index);
    const interval = setInterval(() => {
      setAgendaItems(prevItems => {
        const newItems = [...prevItems];
        if (newItems[index].timeLeft > 0) {
          newItems[index].timeLeft -= 1;
        } else {
          clearInterval(interval);
          setActiveIndex(null);
          new Howl({ src: ['/timer-end.mp3'] }).play();
          if (index + 1 < agendaItems.length) startTimer(index + 1);
        }
        return newItems;
      });
    }, 60000);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(99, 102, 241);
    doc.text("Meeting Agenda", 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let yPos = 40;
    agendaItems.forEach((item, index) => {
      doc.setTextColor(99, 102, 241);
      doc.text(`${index + 1}. ${item.title}`, 20, yPos);
      doc.setTextColor(0, 0, 0);
      doc.text(`Duration: ${item.duration} minutes`, 30, yPos + 7);
      yPos += 20;
    });
    doc.save("meeting-agenda.pdf");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Head>
        <title>Meeting Agenda Planner</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className="container mx-auto px-4 py-8 transition-colors duration-200 ease-in-out">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text">Meeting Agenda Planner</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200 hover:scale-110"
          >
            {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              value={currentItem}
              onChange={(e) => setCurrentItem(e.target.value)}
              placeholder="Agenda Item"
              className="input flex-grow"
            />
            <TimePicker value={currentTime} onChange={setCurrentTime} />
            <button
              onClick={addItem}
              className="btn btn-primary flex items-center justify-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Item
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {agendaItems.map((item, index) => (
            <AgendaItem
              key={item.id}
              item={item}
              index={index}
              startTimer={startTimer}
              removeItem={removeItem}
              isActive={activeIndex === index}
            />
          ))}
        </AnimatePresence>

        {agendaItems.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={exportToPDF}
            className="mt-8 btn btn-secondary flex items-center"
          >
            <DocumentIcon className="h-5 w-5 mr-2" />
            Export to PDF
          </motion.button>
        )}
      </main>
    </div>
  );
}