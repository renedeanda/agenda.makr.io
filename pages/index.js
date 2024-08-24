import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AnimatePresence, motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { PlusIcon, DocumentIcon, MoonIcon, SunIcon, SaveIcon, FolderOpenIcon } from '@heroicons/react/24/outline';
import AgendaItem from '../components/AgendaItem';
import TimePicker from '../components/TimePicker';

export default function Home() {
  const [agendaItems, setAgendaItems] = useState([]);
  const [currentItem, setCurrentItem] = useState('');
  const [currentTime, setCurrentTime] = useState(15);
  const [activeIndex, setActiveIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [currentMeeting, setCurrentMeeting] = useState(null);

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

  useEffect(() => {
    if (activeIndex !== null && agendaItems[activeIndex]) {
      const activeItem = agendaItems[activeIndex];
      document.title = `${activeItem.timeLeft}m - ${activeItem.title}`;
    } else {
      document.title = 'Meeting Agenda Planner';
    }
  }, [activeIndex, agendaItems]);

  const addItem = () => {
    if (currentItem && currentTime > 0) {
      const newItem = {
        id: Date.now(),
        title: currentItem,
        duration: currentTime,
        timeLeft: currentTime,
        isDone: false,
      };
      setAgendaItems(prevItems => [...prevItems, newItem]);
      setCurrentItem('');
      setCurrentTime(15);
    }
  };

  const removeItem = (id) => {
    setAgendaItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const startTimer = (index) => {
    if (activeIndex !== null) return;
    setActiveIndex(index);
    const interval = setInterval(() => {
      setAgendaItems(prevItems => {
        const newItems = [...prevItems];
        if (newItems[index] && newItems[index].timeLeft > 0) {
          newItems[index] = { ...newItems[index], timeLeft: newItems[index].timeLeft - 1 };
        } else {
          clearInterval(interval);
          setActiveIndex(null);
          if (newItems[index]) {
            newItems[index] = { ...newItems[index], isDone: true };
          }
          if (index + 1 < newItems.length) {
            setTimeout(() => startTimer(index + 1), 0);
          }
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
    setDarkMode(prevMode => !prevMode);
  };

  const saveMeeting = () => {
    const meetingName = prompt("Enter a name for this meeting:");
    if (meetingName) {
      setMeetings(prevMeetings => [...prevMeetings, { name: meetingName, agenda: agendaItems }]);
    }
  };

  const loadMeeting = () => {
    const selectedMeeting = prompt("Enter the name of the meeting to load:");
    const meeting = meetings.find(m => m.name === selectedMeeting);
    if (meeting) {
      setAgendaItems(meeting.agenda);
      setCurrentMeeting(selectedMeeting);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Head>
        <title>Meeting Agenda Planner</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <main className="container mx-auto px-4 py-8 transition-colors duration-200 ease-in-out">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text">Meeting Agenda Planner</h1>
          <div className="flex space-x-4">
            <button
              onClick={saveMeeting}
              className="btn btn-secondary flex items-center"
            >
              <SaveIcon className="h-5 w-5 mr-2" />
              Save Meeting
            </button>
            <button
              onClick={loadMeeting}
              className="btn btn-secondary flex items-center"
            >
              <FolderOpenIcon className="h-5 w-5 mr-2" />
              Load Meeting
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200 hover:scale-110"
            >
              {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
          </div>
        </motion.div>

        {currentMeeting && (
          <p className="mb-4 text-lg font-semibold">Current Meeting: {currentMeeting}</p>
        )}

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
              isDone={item.isDone}
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