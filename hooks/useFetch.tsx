import { useState, useEffect } from 'react';

const useFetch = (url: string) => {
    const [data, setData] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const eventData: Event[] = await response.json();
                setData(eventData);
            } catch (error: unknown) { // Explicitly type the error
                if (error instanceof Error) {
                    setError(error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        return () => {
            // Cleanup if needed
        };
    }, [url]);

    return { data, isLoading, error };
};

export default useFetch;
