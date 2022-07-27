import React, {useState} from "react";

type clearTimeout_t =  string | number | NodeJS.Timeout | undefined;

export const useCancellables = () => {
    const [ids, setIds] = useState<clearTimeout_t[]>([])

    React.useEffect(() => {
        return () => {
            for(let fn in ids) {
                clearTimeout(fn);
            }
        };
    }, []);

    const addId = (id: clearTimeout_t) => setIds([...ids, id]);
    const addTimeout = (cb: Function, d: number) => addId(setTimeout(cb,d));

    const handleStates = (states: [Function, number][]) => {
        states.forEach(([cb,d]) => addTimeout(cb,d));
    }

    return handleStates;
};
