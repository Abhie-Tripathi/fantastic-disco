// events/manage/[id]/EventContext.tsx

import { createContext, useContext } from 'react';
import { EventsType } from '@/types/alleventtype'; 

interface EventContextType {
  eventId: string;
  fetchedEvent: EventsType | undefined;
  setAddEventModal: (value: boolean) => void;
  setDeleteModal : (value: boolean) => void;
  setDeleteModalTwo : (value: boolean) => void;
  fetchEventData : () => Promise<null | undefined>;
  isPastEvent : boolean;
}

export const EventContext = createContext<EventContextType | null>(null);

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within a EventContextProvider');
  }
  return context;
};
