import React from 'react';

const TimePicker = ({ value, onChange }) => {
  const hours = Array.from({ length: 4 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  return (
    <div className="flex space-x-2">
      <select
        value={Math.floor(value / 60)}
        onChange={(e) => onChange(parseInt(e.target.value) * 60 + (value % 60))}
        className="input w-20"
      >
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}h
          </option>
        ))}
      </select>
      <select
        value={value % 60}
        onChange={(e) => onChange(Math.floor(value / 60) * 60 + parseInt(e.target.value))}
        className="input w-20"
      >
        {minutes.map((minute) => (
          <option key={minute} value={minute}>
            {minute}m
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimePicker;