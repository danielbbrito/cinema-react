import { useEffect } from "react";

interface ConfirmModalProps {
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "primary" | "warning";
}

export const ConfirmModal = ({
    show,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "danger"
}: ConfirmModalProps) => {
    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        
        return () => {
            document.body.style.overflow = "";
        };
    }, [show]);

    if (!show) return null;

    return (
        <>
            <div 
                className="modal fade show"
                style={{ display: "block" }}
                tabIndex={-1}
                role="dialog"
                aria-labelledby="confirmModalLabel"
                aria-modal="true"
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        onCancel();
                    }
                }}
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="confirmModalLabel">
                                {title}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={onCancel}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p>{message}</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onCancel}
                            >
                                {cancelText}
                            </button>
                            <button
                                type="button"
                                className={`btn btn-${variant}`}
                                onClick={onConfirm}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div 
                className="modal-backdrop fade show"
                onClick={onCancel}
            ></div>
        </>
    );
};

