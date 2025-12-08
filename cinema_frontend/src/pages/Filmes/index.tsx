import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { filmesService } from "../../services/filme.service";
import { type IFilme } from "../../models/filme.model";
import { ConfirmModal } from "../../components/ConfirmModal";

export const FilmesPages = () => {
    const [filmes, setFilmes] = useState<IFilme[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [filmeToDelete, setFilmeToDelete] = useState<{ id: number | string; titulo: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadFilmes();
    }, []);

    const loadFilmes = async () => {
        try {
            setLoading(true);
            const data = await filmesService.findAll();
            setFilmes(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar filmes");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: number | string, titulo: string) => {
        setFilmeToDelete({ id, titulo });
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!filmeToDelete) return;
        
        try {
            await filmesService.delete(filmeToDelete.id);
            setShowDeleteModal(false);
            setFilmeToDelete(null);
            loadFilmes();
        } catch (err) {
            alert("Erro ao excluir filme");
            console.error(err);
            setShowDeleteModal(false);
            setFilmeToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setFilmeToDelete(null);
    };

    const handleViewDetails = (id: number | string) => {
        navigate(`/filmes/${id}`);
    };

    const formatDate = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('pt-BR');
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
                    <i className="bi bi-film me-2"></i>
                    Filmes
                </h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => navigate("/filmes/novo")}
                >
                    <i className="bi bi-plus-circle me-1"></i>
                    Novo Filme
                </button>
            </div>

            {filmes.length === 0 ? (
                <div className="alert alert-info" role="alert">
                    Nenhum filme cadastrado ainda.
                </div>
            ) : (
                <div className="row">
                    {filmes.map((filme) => (
                        <div key={String(filme.id)} className="col-md-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{filme.titulo}</h5>
                                    <p className="card-text">
                                        <small className="text-muted">
                                            <i className="bi bi-tag me-1"></i>
                                            {filme.genero}
                                        </small>
                                    </p>
                                    <p className="card-text">
                                        <small className="text-muted">
                                            <i className="bi bi-clock me-1"></i>
                                            {filme.duracao} min
                                        </small>
                                    </p>
                                    <p className="card-text">
                                        <small className="text-muted">
                                            <i className="bi bi-calendar me-1"></i>
                                            {formatDate(filme.dataInicioExibicao)} - {formatDate(filme.dataFinalExibicao)}
                                        </small>
                                    </p>
                                    <p className="card-text">
                                        <small className="badge bg-secondary">
                                            {filme.classificacao} anos
                                        </small>
                                    </p>
                                    <p className="card-text text-truncate" style={{ maxHeight: "100px" }}>
                                        {filme.sinopse}
                                    </p>
                                </div>
                                <div className="card-footer bg-transparent">
                                    <div className="btn-group w-100" role="group">
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => handleViewDetails(filme.id)}
                                        >
                                            <i className="bi bi-eye me-1"></i>
                                            Ver Detalhes
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDeleteClick(filme.id, filme.titulo)}
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
                message={filmeToDelete ? `Tem certeza que deseja excluir o filme "${filmeToDelete.titulo}"? Esta ação não pode ser desfeita.` : ""}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
};

