import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const MeetingModal = ({ isOpen, closeModal, meetings, loadMeeting, createNewMeeting }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Manage Meetings
              </Dialog.Title>
              <div className="mt-2">
                {meetings.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No meetings saved. Create a new one to get started.
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {meetings.map((meeting) => (
                      <li
                        key={meeting.id}
                        className="py-4 flex justify-between items-center"
                      >
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {meeting.name}
                        </span>
                        <button
                          onClick={() => loadMeeting(meeting.id)}
                          className="ml-2 px-2 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 dark:text-indigo-400 dark:bg-indigo-900 dark:hover:bg-indigo-800"
                        >
                          Load
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={createNewMeeting}
                >
                  Create New Meeting
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MeetingModal;