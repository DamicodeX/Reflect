import { useCallback, useState } from "react";
import { toast } from "sonner";

const useFetch = <TData, TArgs extends unknown[]>(cb: (...args: TArgs) => Promise<TData>) => {
    const [data, setData] = useState<TData | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fn = useCallback(async (...args: TArgs) => {
        setLoading(true);
        setError(null);

        try {
            const response = await cb(...args);
            setData(response);
            setError(null);
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : "An error occurred";
            setError(message);
            toast.error(message);
            return undefined;
        } finally {
            setLoading(false);
        }
    }, [cb]);

    return { data, loading, error, fn, setData };

};

export default useFetch;