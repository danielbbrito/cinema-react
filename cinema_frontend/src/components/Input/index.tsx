interface InputProps {
    id: string;
    label: string;
    type: "text" | "number" | "date";
    placeholder?: string;
    value?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>)  => void;
}

export default function Input( { type="text", placeholder, value, onChange, id, label}: InputProps) {
    return (
        <>
        <label className="form-label" htmlFor={id}>{label}</label>
        <input className="form-control" id={id} type={type} placeholder={placeholder} value={value} onChange={onChange}></input>
        </>
    );
}