import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sessoesService } from "../../services/sessao.service";
import { filmesService } from "../../services/filme.service";
import { salasService } from "../../services/sala.service";
import { type ISessao } from "../../models/sessao.model";
import { ConfirmModal } from "../../components/ConfirmModal";
import { VendaIngressoModal } from "../../components/VendaIngressoModal";

interface SessaoComDetalhes extends ISessao {
    filmeNome?: string;
    salaNumero?: number;
}

export const SessoesPages = () => {
    const [sessoes, setSessoes] = useState<SessaoComDetalhes[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [sessaoToDelete, setSessaoToDelete] = useState<{ id: number | string; filmeNome?: string; salaNumero?: number } | null>(null);
    const [showVendaModal, setShowVendaModal] = useState(false);
    const [sessaoParaVenda, setSessaoParaVenda] = useState<ISessao | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadSessoes();
    }, []);

    const loadSessoes = async () => {
        try {
            setLoading(true);
            const [sessoesData, filmesData, salasData] = await Promise.all([
                sessoesService.findAll(),
                filmesService.findAll(),
                salasService.findAll()
            ]);

            // Fazer join dos dados
            const sessoesComDetalhes: SessaoComDetalhes[] = sessoesData.map(sessao => {
                const filme = filmesData.find(f => String(f.id) === String(sessao.filme));
                const sala = salasData.find(s => String(s.id) === String(sessao.sala));
                
                return {
                    ...sessao,
                    filmeNome: filme?.titulo || "Filme não encontrado",
                    salaNumero: sala?.numero
                };
            });

            setSessoes(sessoesComDetalhes);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar sessões");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (sessao: SessaoComDetalhes) => {
        setSessaoToDelete({
            id: sessao.id,
            filmeNome: sessao.filmeNome,
            salaNumero: sessao.salaNumero
        });
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!sessaoToDelete) return;
        
        try {
            await sessoesService.delete(sessaoToDelete.id);
            setShowDeleteModal(false);
            setSessaoToDelete(null);
            loadSessoes();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erro ao excluir sessão";
            alert(errorMessage);
            console.error(err);
            setShowDeleteModal(false);
            setSessaoToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setSessaoToDelete(null);
    };

    const handleVenderIngresso = (sessao: SessaoComDetalhes) => {
        // Converter para ISessao
        const sessaoParaModal: ISessao = {
            id: sessao.id,
            horario: sessao.horario,
            filme: sessao.filme,
            sala: sessao.sala
        };
        setSessaoParaVenda(sessaoParaModal);
        setShowVendaModal(true);
    };

    const handleVendaSuccess = () => {
        // Recarregar sessões se necessário
        loadSessoes();
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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i className="bi bi-calendar-event me-2"></i>
                    Sessões
                </h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => navigate("/sessoes/novo")}
                >
                    <i className="bi bi-plus-circle me-1"></i>
                    Nova Sessão
                </button>
            </div>

            {sessoes.length === 0 ? (
                <div className="alert alert-info" role="alert">
                    Nenhuma sessão agendada ainda.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Filme</th>
                                <th>Sala</th>
                                <th>Data e Hora</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessoes.map((sessao) => (
                                <tr key={String(sessao.id)}>
                                    <td>
                                        <i className="bi bi-film me-2"></i>
                                        {sessao.filmeNome}
                                    </td>
                                    <td>
                                        <i className="bi bi-door-open me-2"></i>
                                        Sala {sessao.salaNumero || "N/A"}
                                    </td>
                                    <td>
                                        <i className="bi bi-clock me-2"></i>
                                        {formatDateTime(sessao.horario)}
                                    </td>
                                    <td>
                                        <div className="btn-group" role="group">
                                            <button
                                                className="btn btn-outline-success btn-sm"
                                                onClick={() => handleVenderIngresso(sessao)}
                                            >
                                                <i className="bi bi-ticket-perforated me-1"></i>
                                                Vender Ingresso
                                            </button>
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => navigate(`/sessoes/${sessao.id}/editar`)}
                                            >
                                                <i className="bi bi-pencil me-1"></i>
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleDeleteClick(sessao)}
                                            >
                                                <i className="bi bi-trash me-1"></i>
                                                Excluir
                                            </button>
                                        </div>
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
                message={sessaoToDelete ? `Tem certeza que deseja excluir a sessão do filme "${sessaoToDelete.filmeNome}" na Sala ${sessaoToDelete.salaNumero}? Esta ação não pode ser desfeita.` : ""}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="danger"
            />

            <VendaIngressoModal
                show={showVendaModal}
                sessao={sessaoParaVenda}
                onClose={() => {
                    setShowVendaModal(false);
                    setSessaoParaVenda(null);
                }}
                onSuccess={handleVendaSuccess}
            />
        </div>
    );
};

