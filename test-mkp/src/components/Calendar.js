import React from 'react';
import './Calendar.css';

const Calendar = ({ selectedDate, onDateSelect, loads }) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // Get load counts for each date
  const getLoadCount = (date) => {
    const dateStr = date.toLocaleDateString('de-DE', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    return loads.filter(load => load.pickupDate === dateStr).length;
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const loadCount = getLoadCount(date);
      const isSelected = selectedDate && 
        date.toDateString() === selectedDate.toDateString();

      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isSelected ? 'selected' : ''} ${loadCount > 0 ? 'has-loads' : ''}`}
          onClick={() => onDateSelect(date)}
        >
          <span className="day-number">{day}</span>
          {loadCount > 0 && <span className="load-count">{loadCount}</span>}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h3>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="calendar-weekdays">
        <div>MON</div>
        <div>TUE</div>
        <div>WED</div>
        <div>THU</div>
        <div>FRI</div>
        <div>SAT</div>
        <div>SUN</div>
      </div>
      <div className="calendar-days">
        {renderCalendar()}
      </div>
    </div>
  );
};

export default Calendar; 