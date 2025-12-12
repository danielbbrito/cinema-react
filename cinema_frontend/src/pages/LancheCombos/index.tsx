import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { lancheCombosService } from "../../services/lancheCombo.service";
import { type ILancheCombo } from "../../models/lancheCombo.model";
import { ConfirmModal } from "../../components/ConfirmModal";

export const LancheCombosPages = () => {
    const [lancheCombos, setLancheCombos] = useState<ILancheCombo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [lancheComboToDelete, setLancheComboToDelete] = useState<{ id: number | string; nome: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadLancheCombos();
    }, []);

    const loadLancheCombos = async () => {
        try {
            setLoading(true);
            const data = await lancheCombosService.findAll();
            setLancheCombos(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar lanche combos");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: number | string, nome: string) => {
        setLancheComboToDelete({ id, nome });
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!lancheComboToDelete) return;
        
        try {
            await lancheCombosService.delete(lancheComboToDelete.id);
            setShowDeleteModal(false);
            setLancheComboToDelete(null);
            loadLancheCombos();
        } catch (err) {
            alert("Erro ao excluir lanche combo");
            console.error(err);
            setShowDeleteModal(false);
            setLancheComboToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setLancheComboToDelete(null);
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
                    <i className="bi bi-cup-hot me-2"></i>
                    Lanche Combos
                </h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => navigate("/lancheCombos/novo")}
                >
                    <i className="bi bi-plus-circle me-1"></i>
                    Novo Lanche Combo
                </button>
            </div>

            {lancheCombos.length === 0 ? (
                <div className="alert alert-info" role="alert">
                    Nenhum lanche combo cadastrado ainda.
                </div>
            ) : (
                <div className="row">
                    {lancheCombos.map((combo) => (
                        <div key={String(combo.id)} className="col-md-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <i className="bi bi-cup-hot me-2"></i>
                                        {combo.nome}
                                    </h5>
                                    <p className="card-text">
                                        <strong><i className="bi bi-info-circle me-2"></i>Descrição:</strong> {combo.descricao}
                                    </p>
                                    <p className="card-text">
                                        <strong><i className="bi bi-currency-dollar me-2"></i>Valor Unitário:</strong> R$ {combo.valorUnitario.toFixed(2)}
                                    </p>
                                    <p className="card-text">
                                        <strong><i className="bi bi-123 me-2"></i>Quantidade:</strong> {combo.qtUnidade} unidade(s)
                                    </p>
                                    <p className="card-text">
                                        <strong><i className="bi bi-cash-stack me-2"></i>Subtotal:</strong> R$ {combo.subtotal.toFixed(2)}
                                    </p>
                                </div>
                                <div className="card-footer bg-transparent">
                                    <div className="btn-group w-100" role="group">
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => navigate(`/lancheCombos/${combo.id}/editar`)}
                                        >
                                            <i className="bi bi-pencil me-1"></i>
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDeleteClick(combo.id, combo.nome)}
                                        >
                                            <i className="bi bi-trash me-1"></i>
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmModal
                show={showDeleteModal}
                title="Confirmar Exclusão"
                message={lancheComboToDelete ? `Tem certeza que deseja excluir o lanche combo "${lancheComboToDelete.nome}"? Esta ação não pode ser desfeita.` : ""}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
};

