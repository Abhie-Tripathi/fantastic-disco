import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface BulkActionParams {
  eventIds: string[];
  actionType: 'bookmarked' | string;
  actionStatus?: string;
  trackerId?: string;
  events: any[];
  setInterest?: (value: any) => void;
  setEventId?: (value: string) => void;
  setSavedEventCount?: (value: number | ((prev: number) => number)) => void;
  removeBookmark: (interestId: string) => Promise<any>;
  createUserEventInterest: (params: {
    eventId: string;
    interest: string;
    sourceModule: string;
    sourceId?: string;
  }) => Promise<any>;
}

export const useBulkEventActions = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const executeBulkAction = async ({
    eventIds,
    actionType,
    actionStatus,
    trackerId,
    events,
    setInterest,
    setEventId,
    setSavedEventCount,
    removeBookmark,
    createUserEventInterest
  }: BulkActionParams) => {
    setIsProcessing(true);
    setProgress(0);
    const totalItems = eventIds.length;

    try {
      if (actionType === 'bookmarked') {
        for (let i = 0; i < eventIds.length; i++) {
          const id = eventIds[i];
          const eventToUnbookmark = events.find(event => event.basic.id === id);
          
          const response = await removeBookmark(eventToUnbookmark?.interests?.bookmark?.interestId);
          
          if (response?.interest && setInterest) {
            setInterest(prev => ({
              ...prev,
              [response.interest.toLowerCase()]: {
                interestId: response.id,
              },
            }));
          }
          setProgress(((i + 1) / totalItems) * 100);
        }
      } else {
        for (let i = 0; i < eventIds.length; i++) {
          const id = eventIds[i];
          const response = await createUserEventInterest({
            eventId: id,
            interest: actionStatus || '',
            sourceModule: 'TRACKER',
            ...(trackerId && { sourceId: trackerId }),
          });

          if (response?.interest && setInterest) {
            setInterest(prev => ({
              ...prev,
              [response.interest.toLowerCase()]: {
                interestId: response.id,
              },
            }));
          }
          if (response?.eventId && setEventId) {
            setEventId(response.eventId);
          }
          if (setSavedEventCount) {
            setSavedEventCount(prev => prev + 1);
          }
          setProgress(((i + 1) / totalItems) * 100);
        }
      }

      toast({
        title: 'Success',
        description: `Processed ${totalItems} items successfully`,
        variant: 'default',
      });
      return { success: true, processedCount: totalItems };
    } catch (error) {
      console.error('Bulk action error:', error);
      toast({
        title: 'Error',
        description: 'Some items failed to process',
        variant: 'destructive',
      });
      return { success: false, processedCount: Math.floor((progress / 100) * totalItems) };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    executeBulkAction,
    isProcessing,
    progress,
  };
};