interface ButtonProps {
    type: "button" | "submit";
    label: string;
    variant?: "primary" | "secondary" | "danger";
    onClick?: () => void;
}

export default function Button(
    { type = "button", label, variant = "danger", onClick }: ButtonProps
) {
    return (
        <>
            <button className={"btn btn-" + variant} type={type} onClick={onClick}>{label}</button>
        </>
    );
}