import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { salasService } from "../../services/sala.service";
import { type ISala } from "../../models/sala.model";
import { ConfirmModal } from "../../components/ConfirmModal";

export const SalasPages = () => {
    const [salas, setSalas] = useState<ISala[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [salaToDelete, setSalaToDelete] = useState<{ id: number | string; numero: number } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadSalas();
    }, []);

    const loadSalas = async () => {
        try {
            setLoading(true);
            const data = await salasService.findAll();
            setSalas(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar salas");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: number | string, numero: number) => {
        setSalaToDelete({ id, numero });
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!salaToDelete) return;
        
        try {
            await salasService.delete(salaToDelete.id);
            setShowDeleteModal(false);
            setSalaToDelete(null);
            loadSalas();
        } catch (err) {
            alert("Erro ao excluir sala");
            console.error(err);
            setShowDeleteModal(false);
            setSalaToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setSalaToDelete(null);
    };

    const calculateTotalSeats = (poltronas: number[][]) => {
        return poltronas.reduce((total, row) => total + row.length, 0);
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i className="bi bi-door-open me-2"></i>
                    Salas
                </h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => navigate("/salas/novo")}
                >
                    <i className="bi bi-plus-circle me-1"></i>
                    Nova Sala
                </button>
            </div>

            {salas.length === 0 ? (
                <div className="alert alert-info" role="alert">
                    Nenhuma sala cadastrada ainda.
                </div>
            ) : (
                <div className="row">
                    {salas.map((sala) => {
                        const totalSeats = calculateTotalSeats(sala.poltronas);
                        return (
                            <div key={String(sala.id)} className="col-md-4 mb-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            <i className="bi bi-door-open me-2"></i>
                                            Sala {sala.numero}
                                        </h5>
                                        <p className="card-text">
                                            <strong><i className="bi bi-people me-2"></i>Capacidade:</strong> {sala.capacidade} pessoas
                                        </p>
                                        <p className="card-text">
                                            <strong><i className="bi bi-grid-3x3 me-2"></i>Poltronas:</strong> {totalSeats} assentos
                                        </p>
                                        <p className="card-text">
                                            <small className="text-muted">
                                                <i className="bi bi-info-circle me-1"></i>
                                                {sala.poltronas.length} fileiras
                                            </small>
                                        </p>
                                    </div>
                                    <div className="card-footer bg-transparent">
                                        <div className="btn-group w-100" role="group">
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => navigate(`/salas/${sala.id}/editar`)}
                                            >
                                                <i className="bi bi-pencil me-1"></i>
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleDeleteClick(sala.id, sala.numero)}
                                            >
                                                <i className="bi bi-trash me-1"></i>
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <ConfirmModal
                show={showDeleteModal}
                title="Confirmar Exclusão"
                message={salaToDelete ? `Tem certeza que deseja excluir a Sala ${salaToDelete.numero}? Esta ação não pode ser desfeita.` : ""}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
};

