import { useEffect, useState } from "react";
import { pedidosService } from "../../services/pedido.service";
import { type IPedido } from "../../models/pedido.model";
import { ConfirmModal } from "../../components/ConfirmModal";

export const PedidosPages = () => {
    const [pedidos, setPedidos] = useState<IPedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pedidoToDelete, setPedidoToDelete] = useState<{ id: number | string; valorTotal: number } | null>(null);

    useEffect(() => {
        loadPedidos();
    }, []);

    const loadPedidos = async () => {
        try {
            setLoading(true);
            const data = await pedidosService.findAll();
            setPedidos(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar pedidos");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: number | string, valorTotal: number) => {
        setPedidoToDelete({ id, valorTotal });
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!pedidoToDelete) return;
        
        try {
            await pedidosService.delete(pedidoToDelete.id);
            setShowDeleteModal(false);
            setPedidoToDelete(null);
            loadPedidos();
        } catch (err) {
            alert("Erro ao excluir pedido");
            console.error(err);
            setShowDeleteModal(false);
            setPedidoToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setPedidoToDelete(null);
    };

    const formatDateTime = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
            <h2>
                <i className="bi bi-receipt me-2"></i>
                Pedidos
            </h2>

            {pedidos.length === 0 ? (
                <div className="alert alert-info mt-4" role="alert">
                    Nenhum pedido cadastrado ainda.
                </div>
            ) : (
                <div className="table-responsive mt-4">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Data/Hora</th>
                                <th>Ingressos Inteira</th>
                                <th>Ingressos Meia</th>
                                <th>Lanche Combos</th>
                                <th>Valor Total</th>
                                <th>Método Pagamento</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.map((pedido) => (
                                <tr key={String(pedido.id)}>
                                    <td>{pedido.id}</td>
                                    <td>{formatDateTime(pedido.dataHora)}</td>
                                    <td>{pedido.ingressosInteiraQtd}</td>
                                    <td>{pedido.ingressosMeiaQtd}</td>
                                    <td>
                                        {pedido.lancheCombos && pedido.lancheCombos.length > 0 
                                            ? `${pedido.lancheCombos.length} combo(s)`
                                            : 'Nenhum'
                                        }
                                    </td>
                                    <td>
                                        <strong>R$ {pedido.valorTotal.toFixed(2)}</strong>
                                    </td>
                                    <td>{pedido.metodoPagamento}</td>
                                    <td>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDeleteClick(pedido.id, pedido.valorTotal)}
                                        >
                                            <i className="bi bi-trash me-1"></i>
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmModal
                show={showDeleteModal}
                title="Confirmar Exclusão"
                message={pedidoToDelete ? `Tem certeza que deseja excluir o pedido #${pedidoToDelete.id} (R$ ${pedidoToDelete.valorTotal.toFixed(2)})? Esta ação não pode ser desfeita.` : ""}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
};

