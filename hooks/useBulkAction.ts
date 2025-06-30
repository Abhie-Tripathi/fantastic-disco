import { useTrackerContext } from '@/context/tracker';
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
  const{ setSavedEventCount } = useTrackerContext();
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
        if(action?.status === "UN-BOOKMARK")
        setSavedEventCount?.(((prev:number) => prev - validUnbookmarkEntries.length));
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
      const alreadyHasInterest = Boolean(value?.interests?.[interestKey]);
      if (alreadyHasInterest) {
        return false;
      }

      if (!eventId || !value) {
        return false;
      }

      return true;
    }
  );

  if (validInterestEntries.length === 0) {
    return;
  }
  if(action?.status === "BOOKMARK")
  setSavedEventCount?.((prev: number) => prev + validInterestEntries.length);
  const interestResults = await Promise.allSettled(
    validInterestEntries.map(async ([eventId]) => {
      try {
        const currentEntry = selectedInterestMap.get(eventId);
        
        if (currentEntry?.[interestKey]!==undefined) {
          return { eventId, skipped: true };
        }

        const response = await apiFunctions.createUserEventInterest({
          eventId,
          interest: action?.status,
          sourceModule: sourceModule || "",
          ...(trackerId && { sourceId: trackerId }),
        });

        const responseInterestKey = response.interest?.toLowerCase?.();
        if (!responseInterestKey) throw new Error("No interest in response");

        setUpdatedEvents?.((prev: Event[] = []) =>
          prev.map((event) =>
            event.basic.id === response.eventId
              ? {
                  ...event,
                  interests: {
                    ...event.interests,
                    [responseInterestKey]: { interestId: response.id },
                  },
                }
              : event
          )
        );
        return { eventId, response };
      } catch (error) {
        console.error(`${eventId} failed:`, error);
        throw { eventId, error };
      }
    })
  );

  interestResults.forEach((result, i) => {
    const [eventId] = validInterestEntries[i];
    console.group(`Event ${eventId}`);
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
