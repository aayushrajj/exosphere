
import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users, Plus, X } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  attendees: string[];
  date: string;
}

const Scheduler = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Finance Review',
      start_time: '14:30',
      end_time: '15:30',
      attendees: ['CEO', 'CFO'],
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '2',
      title: 'Sales Pipeline Review',
      start_time: '10:00',
      end_time: '11:00',
      attendees: ['CEO', 'Sales'],
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0]
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    start_time: '',
    end_time: '',
    attendees: [] as string[]
  });

  const attendeeOptions = ['CEO', 'CFO', 'Finance', 'Sales', 'COO', 'HR', 'Ops'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDateForCalendar = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month, day).toISOString().split('T')[0];
  };

  const getEventsForDate = (dateString: string) => {
    return events.filter(event => event.date === dateString);
  };

  const handleDateClick = (day: number) => {
    const dateString = formatDateForCalendar(day);
    setSelectedDate(dateString);
    setShowAddModal(true);
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.start_time && newEvent.end_time && selectedDate) {
      const event: CalendarEvent = {
        id: Date.now().toString(),
        title: newEvent.title,
        start_time: newEvent.start_time,
        end_time: newEvent.end_time,
        attendees: newEvent.attendees,
        date: selectedDate
      };
      
      setEvents([...events, event]);
      setNewEvent({ title: '', start_time: '', end_time: '', attendees: [] });
      setShowAddModal(false);
      console.log('New meeting scheduled:', event);
    }
  };

  const toggleAttendee = (attendee: string) => {
    setNewEvent(prev => ({
      ...prev,
      attendees: prev.attendees.includes(attendee)
        ? prev.attendees.filter(a => a !== attendee)
        : [...prev.attendees, attendee]
    }));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meeting Scheduler</h1>
              <p className="text-gray-600 mt-1">Schedule and manage your executive meetings</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Meeting
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Calendar header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              →
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {dayNames.map(day => (
              <div key={day} className="p-4 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-24 border-r border-b border-gray-100"></div>;
              }

              const dateString = formatDateForCalendar(day);
              const dayEvents = getEventsForDate(dateString);
              const isToday = dateString === new Date().toISOString().split('T')[0];

              return (
                <div
                  key={day}
                  className="h-24 border-r border-b border-gray-100 p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleDateClick(day)}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate"
                      >
                        {event.start_time} {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Meeting Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Schedule Meeting</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Meeting title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter meeting title"
                />
              </div>

              {/* Date (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="text"
                  value={selectedDate ? new Date(selectedDate).toLocaleDateString() : ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.start_time}
                    onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.end_time}
                    onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Attendees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attendees
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {attendeeOptions.map(attendee => (
                    <label key={attendee} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newEvent.attendees.includes(attendee)}
                        onChange={() => toggleAttendee(attendee)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{attendee}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduler;
