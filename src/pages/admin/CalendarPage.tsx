import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/apiClient';
import { CalendarEvent, Project, Employee } from '../../types/models';
import Button from '../../components/ui/Button';
import EventModal from '../../components/calendar/EventModal';

export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery<CalendarEvent[]>({
    queryKey: ['calendar'],
    queryFn: () => api.get<CalendarEvent[]>('/calendar'),
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => api.get<Project[]>('/projects'),
  });

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: () => api.get<Employee[]>('/employees'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/calendar/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEventClick = (arg: any) => {
    const event = events.find((e) => e.id === arg.event.id);
    if (event) {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteMutation.mutate(id);
      setIsModalOpen(false);
    }
  };

  const handleSubmitEvent = async (data: any) => {
    if (selectedEvent) {
      await api.put(`/calendar/${selectedEvent.id}`, data);
    } else {
      await api.post('/calendar', data);
    }
    queryClient.invalidateQueries({ queryKey: ['calendar'] });
    setIsModalOpen(false);
  };

  const calendarEvents = events.map((event) => {
    const project = projects.find((p) => p.id === event.projectId);
    const eventEmployees = employees.filter((e) => event.employeeIds.includes(e.id));

    return {
      id: event.id,
      title: event.title,
      start: event.startDate,
      end: event.endDate,
      extendedProps: {
        type: event.type,
        project: project?.name,
        employees: eventEmployees.map((e) => e.name).join(', '),
      },
      backgroundColor: project?.status === 'completed' ? '#10b981' : 
                     project?.status === 'cancelled' ? '#ef4444' :
                     project?.priority === 'critical' ? '#dc2626' :
                     project?.priority === 'high' ? '#f59e0b' : '#3b82f6',
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Event</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={calendarEvents}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          editable={true}
          selectable={true}
          eventDrop={(arg) => {
            const updatedEvent = events.find((e) => e.id === arg.event.id);
            if (updatedEvent) {
              handleSubmitEvent({
                ...updatedEvent,
                startDate: arg.event.start.toISOString(),
                endDate: arg.event.end?.toISOString() || updatedEvent.endDate,
              });
            }
          }}
          eventResize={(arg) => {
            const updatedEvent = events.find((e) => e.id === arg.event.id);
            if (updatedEvent) {
              handleSubmitEvent({
                ...updatedEvent,
                startDate: arg.event.start.toISOString(),
                endDate: arg.event.end?.toISOString() || updatedEvent.endDate,
              });
            }
          }}
        />
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitEvent}
        event={selectedEvent}
        projects={projects}
        employees={employees}
        selectedDate={selectedDate}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}
