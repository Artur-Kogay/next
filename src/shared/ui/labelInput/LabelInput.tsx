import styles from './LabelInput.module.scss'
import {InputHTMLAttributes} from "react";
import clsx from "clsx";

interface LabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string
}

function LabelInput({label, error, ...props}: LabelInputProps) {
    return (
        <div>
            {
                error && <span className={styles.errorMessage}>{error}</span>
            }
            <label className={clsx(styles.label, error && styles.errorInput)}>
                {label}
                <input className={styles.labelInput} {...props}/>
            </label>
        </div>
    );
}

export default LabelInput;