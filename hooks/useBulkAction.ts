import { Event } from '@/types/events';
import { useState } from 'react';

interface InterestResponse {
  eventId: string;
  interest: string;
  id: string;
}

interface BulkActionParams {
  action: {
    label: string;
    status: string;
  } | undefined;
  selectedInterestMap: Map<string, any>;
  updatedEvents?: any[];
  totalChecked: string[];
  sourceModule?: string;
  trackerId?: string;
}

interface BulkActionCallbacks {
  setInterest?: (value: any) => void;
  setUpdatedEvents?: (value: ((prev: Event[]) => Event[]) | Event[]) => void;
  setSelectedInterestMap?: (value: Map<string, any>) => void;
  setShowCheckBox?: (value: boolean) => void;
  setTotalChecked?: (value: string[]) => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface ApiFunctions {
  removeBookmark: (id: string) => Promise<any>;
  createUserEventInterest: (params: any) => Promise<any>; // updated to use Promise-based mutateAsync
}

export const useBulkActions = (apiFunctions: ApiFunctions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const executeBulkAction = async (
    params: BulkActionParams,
    callbacks: BulkActionCallbacks
  ) => {
    const {
      action,
      selectedInterestMap,
      updatedEvents,
      totalChecked,
      sourceModule,
      trackerId
    } = params;

    const {
      setInterest,
      setUpdatedEvents,
      setSelectedInterestMap,
      setShowCheckBox,
      setTotalChecked,
      onSuccess,
      onError
    } = callbacks;

    setIsLoading(true);
    setError(null);

    try {
      if (action?.status === "UN-BOOKMARK") {
        const validUnbookmarkEntries = Array.from(selectedInterestMap.entries())
          .filter(([eventId, value]) => {
            const isValid = eventId && value?.bookmark !== undefined;
            if (!isValid) {
              console.warn('Skipping invalid unbookmark entry:', { eventId, value });
            }
            return isValid;
          });

        await Promise.all(
          validUnbookmarkEntries.map(async ([eventId, value]) => {
            try {
              const response = await apiFunctions.removeBookmark(value.bookmark);
              if (response?.interest && setInterest) {
                setInterest((prev: any) => ({
                  ...prev,
                  [response.interest.toLowerCase()]: {
                    interestId: response.id,
                  },
                }));
              }
              setUpdatedEvents?.((prev:Event[]) =>
  prev?.map(event => {
    if (event.basic.id !== response.eventId) return event;

    const updatedInterests = { ...event.interests };
    delete updatedInterests.bookmark;

    return {
      ...event,
      interests: updatedInterests
    };
  })
);


              return response;
            } catch (err) {
              console.error(`Failed to unbookmark ${eventId}:`, err);
              throw err;
            }
          })
        );
      } else {
        const interestKey = action?.status?.toLowerCase();

if (!interestKey) {
  console.warn("Invalid action status:", action?.status);
  return;
}

const validInterestEntries = Array.from(selectedInterestMap.entries()).filter(
  ([eventId, value]) => {
    const isValid = eventId && !value?.interests?.[interestKey];
    if (!isValid) {
      console.warn('Skipping invalid interest entry:', { eventId, value });
    }
    return isValid;
  }
);


        const interestResults = await Promise.allSettled(
          validInterestEntries.map(async ([eventId, _]) => {
            try {
              const response = await apiFunctions.createUserEventInterest({
                eventId,
                interest: action?.status,
                sourceModule: sourceModule || '',
                ...(trackerId && { sourceId: trackerId }),
              });

               const interestKey = response.interest.toLowerCase();

    // Update states using functional updates to ensure we get the latest state

    setUpdatedEvents?.((prev: Event[]) => prev?.map(event => 
      event.basic.id === response.eventId ? {
        ...event,
        interests: {
          ...event.interests,
          [interestKey]: { interestId: response.id }
        }
      } : event
    ));

    // setSelectedInterestMap(prev => {
    //   const newMap = new Map(prev);
    //   const currentEntry = newMap.get(response.eventId) || {};
    //   newMap.set(response.eventId, {
    //     ...currentEntry,
    //     [interestKey]: response.id
    //   });
    //   return newMap;
    // });


              console.log(`${action?.status} success for ${eventId}:`, response);

              return { eventId, response };
            } catch (error) {
              console.error(`${action?.status} failed for ${eventId}:`, error);
              throw { eventId, error };
            }
          })
        );

        console.group(`${action?.status} Results`);
        interestResults.forEach((result, index) => {
          const [eventId] = validInterestEntries[index];
          console.group(`Event ${eventId}`);
          if (result.status === 'fulfilled') {
            console.log('✅ Success:', result.value.response);
          } else {
            console.error('❌ Error:', result.reason.error);
          }
          console.groupEnd();
        });
        console.groupEnd();
      }


      setShowCheckBox?.(false);
      setTotalChecked?.([]);
      onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Bulk action failed');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    executeBulkAction,
    isLoading,
    error,
    resetError: () => setError(null)
  };
};
