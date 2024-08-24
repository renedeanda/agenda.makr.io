import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import AgendaItem from '../components/AgendaItem';
import TimePicker from '../components/TimePicker';
import Timer from '../components/Timer';
import Layout from '../components/Layout';
import exportToPDF from '../utils/exportToPdf';

export default function Home() {
  const [agendaItems, setAgendaItems] = useState([]);
  const [currentItem, setCurrentItem] = useState('');
  const [currentTime, setCurrentTime] = useState(15);
  const [activeIndex, setActiveIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedMeetings = JSON.parse(localStorage.getItem('meetings') || '[]');
    setMeetings(savedMeetings);
    setDarkMode(localStorage.getItem('darkMode') === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('meetings', JSON.stringify(meetings));
  }, [meetings]);

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
        timeLeft: currentTime * 60, // Convert to seconds
        isDone: false,
      };
      setAgendaItems(prevItems => [...prevItems, newItem]);
      setCurrentItem('');
      setCurrentTime(15);
    }
  };

  const removeItem = (id) => {
    setAgendaItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== id);
      if (activeIndex !== null && newItems.length <= activeIndex) {
        setActiveIndex(null);
      }
      return newItems;
    });
  };

  const startTimer = (index) => {
    if (activeIndex !== null) return;
    setActiveIndex(index);
  };

  const updateItemTime = (index, newTimeLeft) => {
    setAgendaItems(prevItems => {
      const newItems = [...prevItems];
      if (newItems[index]) {
        newItems[index] = { ...newItems[index], timeLeft: newTimeLeft };
      }
      return newItems;
    });
  };

  const onTimerComplete = () => {
    setAgendaItems(prevItems => {
      const newItems = [...prevItems];
      if (newItems[activeIndex]) {
        newItems[activeIndex] = { ...newItems[activeIndex], isDone: true, timeLeft: 0 };
      }
      return newItems;
    });
    setActiveIndex(prevIndex => {
      if (prevIndex + 1 < agendaItems.length) {
        return prevIndex + 1;
      }
      return null;
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const saveMeeting = () => {
    const meetingName = prompt("Enter a name for this meeting:");
    if (meetingName) {
      const newMeeting = { id: Date.now(), name: meetingName, agenda: agendaItems };
      setMeetings(prevMeetings => [...prevMeetings, newMeeting]);
      setCurrentMeeting(newMeeting);
    }
  };

  const loadMeeting = () => {
    setIsModalOpen(true);
  };

  const selectMeeting = (id) => {
    const meeting = meetings.find(m => m.id === id);
    if (meeting) {
      setAgendaItems(meeting.agenda);
      setCurrentMeeting(meeting);
    }
    setIsModalOpen(false);
  };

  const createNewMeeting = () => {
    setAgendaItems([]);
    setCurrentMeeting(null);
    setIsModalOpen(false);
  };

  return (
    <Layout
      saveMeeting={saveMeeting}
      loadMeeting={loadMeeting}
      toggleDarkMode={toggleDarkMode}
      darkMode={darkMode}
    >
      <Head>
        <title>Meeting Agenda Planner</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <div className="space-y-6">
        {currentMeeting && (
          <p className="text-lg font-semibold">Current Meeting: {currentMeeting.name}</p>
        )}

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            value={currentItem}
            onChange={(e) => setCurrentItem(e.target.value)}
            placeholder="Agenda Item"
            className="input flex-grow"
          />
          <TimePicker value={currentTime} onChange={setCurrentTime} />
          <div className="px-4 sm:px-0">
            <button
              onClick={addItem}
              className="flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-6 w-6 sm:h-8 sm:w-8 mr-2" />
              Add Item
            </button>
          </div>
        </div>

        {activeIndex !== null && agendaItems[activeIndex] && (
          <Timer
            duration={agendaItems[activeIndex].duration * 60}
            timeLeft={agendaItems[activeIndex].timeLeft}
            isActive={true}
            onComplete={onTimerComplete}
            onTick={(newTimeLeft) => updateItemTime(activeIndex, newTimeLeft)}
          />
        )}

        <AnimatePresence>
          {agendaItems.map((item, index) => (
            <AgendaItem
              key={item.id}
              item={item}
              index={index}
              startTimer={startTimer}
              removeItem={removeItem}
              isActive={activeIndex === index}
              isDone={item.isDone}
            />
          ))}
        </AnimatePresence>

        {agendaItems.length > 0 && (
          <div className="px-4 sm:px-0 flex justify-center mt-6">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onClick={() => exportToPDF(currentMeeting, agendaItems)}
              className="flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-orange-400 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105 hover:from-orange-500 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <DocumentTextIcon className="h-6 w-6 sm:h-8 sm:w-8 mr-2" />
              Export to PDF
            </motion.button>
          </div>
        )}
      </div>
      <div className="text-center mt-6">
        <a
          href="https://renedeanda.com?utm_source=agenda_maker"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-block px-4 py-2 rounded-full transition duration-300 ${darkMode
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
        >
          Made with 🧡 + 🤖 by René DeAnda
        </a>
      </div>
    </Layout>
  );
}