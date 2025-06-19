import { useState } from 'react';

interface InterestResponse {
  eventId: string;
  interest: string;
  id: string;
}

interface BulkActionParams {
  action: {
    label: string; 
    status: string  
  } | undefined;
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
    setIsLoading(true);
    setError(null);
    
    try {
      let operations: Promise<any>[] = [];

      if (params.action?.status === "UN-BOOKMARK") {
        // Process UN-BOOKMARK actions
        operations = Array.from(params.selectedInterestMap.entries())
          .filter(([_, value]) => value?.bookmark)
          .map(async ([eventId, value]) => {
            try {
              const response = await apiFunctions.removeBookmark(value.bookmark);
              callbacks.setInterest?.(prev => ({
                ...prev,
                bookmark: undefined
              }));
              return response;
            } catch (err) {
              console.error(`Unbookmark failed for ${eventId}:`, err);
              throw err;
            }
          });
      } else {
        // Process other actions
        operations = params.totalChecked.map(eventId => 
          new Promise<void>((resolve, reject) => {
            apiFunctions.createUserEventInterest(
              {
                eventId,
                interest: params.action?.status,
                sourceModule: params.sourceModule,
                ...(params.trackerId && { sourceId: params.trackerId })
              },
              {
                onSuccess: (response) => {
                  try {
                    if (!response?.eventId || !response?.interest || !response?.id) {
                      throw new Error('Invalid response format');
                    }

                    const interestKey = response.interest.toLowerCase();

                    // Batch state updates
                    Promise.resolve().then(() => {
                      callbacks.setUpdatedEvents?.(prev => 
                        prev?.map(event => 
                          event.basic.id === response.eventId ? {
                            ...event,
                            interests: {
                              ...event.interests,
                              [interestKey]: { interestId: response.id }
                            }
                          } : event
                        )
                      );

                      callbacks.setSelectedInterestMap?.(prev => {
                        const newMap = new Map(prev);
                        newMap.set(response.eventId, {
                          ...(newMap.get(response.eventId) || {}),
                          [interestKey]: response.id
                        });
                        return newMap;
                      });

                      callbacks.setInterest?.(prev => ({
                        ...prev,
                        [interestKey]: { interestId: response.id }
                      }));
                    }).then(resolve).catch(reject);
                  } catch (err) {
                    reject(err);
                  }
                },
                onError: reject
              }
            );
          })
        );
      }

      // Wait for ALL operations to complete
      await Promise.all(operations);

      // Final cleanup
      callbacks.setShowCheckBox?.(false);
      callbacks.setTotalChecked?.([]);
      callbacks.onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      callbacks.onError?.(error);
    } finally {
      // This will ALWAYS run after try/catch
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