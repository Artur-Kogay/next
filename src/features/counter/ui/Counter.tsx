'use client'
import { Minus, Plus } from 'lucide-react';
import styles from './Counter.module.scss'

interface CounterProps {
    count: number;
    setCount: (value: number) => void;
}

function Counter({count = 1, setCount}: CounterProps) {

    const increment = () => {
        setCount(count + 1);
    }

    const decrement = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    }

    return (
        <div className={styles.counter}>
            <button onClick={decrement}><Minus size={20}/></button>
            <span>{count}</span>
            <button onClick={increment}><Plus size={20}/></button>
        </div>
    );
}

export default Counter;