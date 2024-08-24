import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import AgendaItem from '../components/AgendaItem';
import TimePicker from '../components/TimePicker';
import Timer from '../components/Timer';
import Layout from '../components/Layout';
import MeetingModal from '../components/MeetingModal';
import exportToPDF from '../utils/exportToPDF';

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
  };

  const onTimerComplete = () => {
    setAgendaItems(prevItems => {
      const newItems = [...prevItems];
      if (newItems[activeIndex]) {
        newItems[activeIndex] = { ...newItems[activeIndex], isDone: true };
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
          <button
            onClick={addItem}
            className="btn btn-primary flex items-center justify-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Item
          </button>
        </div>

        {activeIndex !== null && (
          <Timer
            duration={agendaItems[activeIndex].duration}
            isActive={true}
            onComplete={onTimerComplete}
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
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={() => exportToPDF(currentMeeting, agendaItems)}
            className="mt-8 btn btn-secondary flex items-center"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Export to PDF
          </motion.button>
        )}
      </div>

      <MeetingModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        meetings={meetings}
        loadMeeting={selectMeeting}
        createNewMeeting={createNewMeeting}
      />
    </Layout>
  );
}