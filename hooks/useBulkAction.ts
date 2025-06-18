import { useState } from 'react';

interface InterestResponse {
  eventId: string;
  interest: string;
  id: string;
}

interface BulkActionParams {
  action: {
    status: string;
  };
  selectedInterestMap: Map<string, any>;
  updatedEvents?: any[];
  totalChecked: string[];
  sourceModule?: string;
  trackerId?: string;
}

interface BulkActionCallbacks {
  setInterest?: (value: any) => void;
  setUpdatedEvents?: (value: any[]) => void;
  setSelectedInterestMap?: (value: Map<string, any>) => void;
  setShowCheckBox?: (value: boolean) => void;
  setTotalChecked?: (value: string[]) => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface ApiFunctions {
  removeBookmark: (id: string) => Promise<any>;
  createUserEventInterest: (
    params: any,
    callbacks: { onSuccess: (data: any) => void; onError: (error: any) => void }
  ) => void;
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
    console.log("bulk action called", action,
      selectedInterestMap,
      updatedEvents,
      totalChecked,
      sourceModule,
      trackerId);
    
    try {
      if (action.status === "UN-BOOKMARK") {
        // Process UN-BOOKMARK actions
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
              return response;
            } catch (err) {
              console.error(`Failed to unbookmark ${eventId}:`, err);
              throw err;
            }
          })
        );
      } else {
        // Process other actions (BOOKMARK, ATTEND, etc.)
        const validInterestEntries = Array.from(selectedInterestMap.entries())
          .filter(([eventId, value]) => {
            const isValid = eventId && value[action.status.toLowerCase()] === undefined;
            if (!isValid) {
              console.warn('Skipping invalid interest entry:', { eventId, status: action.status, value });
            }
            return isValid;
          });

        await Promise.all(
          validInterestEntries.map(([eventId, _]) => {
            return new Promise<void>((resolve, reject) => {
              apiFunctions.createUserEventInterest(
                {
                  eventId,
                  interest: action.status,
                  sourceModule: sourceModule || '',
                  ...(trackerId && { sourceId: trackerId }),
                },
                {
                  onSuccess: (response: any) => {
                    try {
                      if (!response?.eventId || !response?.interest || !response?.id) {
                        throw new Error('Invalid response from server');
                      }

                      const interestKey = response.interest.toLowerCase();

                      // Update all states atomically
                      setInterest?.((prev: any) => ({
                        ...prev,
                        [interestKey]: { interestId: response.id }
                      }));

                      setUpdatedEvents?.(prev => prev?.map(event => 
                        event.basic.id === response.eventId ? {
                          ...event,
                          interests: {
                            ...event.interests,
                            [interestKey]: { interestId: response.id }
                          }
                        } : event
                      ));

                      setSelectedInterestMap?.(prev => {
                        const newMap = new Map(prev);
                        newMap.set(response.eventId, {
                          ...(newMap.get(response.eventId) || {}),
                          [interestKey]: true
                        });
                        return newMap;
                      });

                      resolve();
                    } catch (err) {
                      console.error(`Error processing response for ${eventId}:`, err);
                      reject(err);
                    }
                  },
                  onError: (error) => {
                    console.error(`API error for ${eventId}:`, error);
                    reject(error);
                  }
                }
              );
            });
          })
        );
      }

      // Reset UI states after successful completion
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