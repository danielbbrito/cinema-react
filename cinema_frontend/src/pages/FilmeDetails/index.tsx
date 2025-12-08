import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { filmesService } from "../../services/filme.service";
import { type IFilme } from "../../models/filme.model";

export const FilmeDetailsPages = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [filme, setFilme] = useState<IFilme | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadFilme();
        }
    }, [id]);

    const loadFilme = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await filmesService.findById(id);
            setFilme(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar filme");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('pt-BR', {
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

    if (error || !filme) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    {error || "Filme não encontrado"}
                </div>
                <button className="btn btn-secondary" onClick={() => navigate("/filmes")}>
                    Voltar para Lista
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="mb-3">
                <button 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/filmes")}
                >
                    <i className="bi bi-arrow-left me-1"></i>
                    Voltar
                </button>
            </div>

            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">
                        <i className="bi bi-film me-2"></i>
                        {filme.titulo}
                    </h3>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <p>
                                <strong><i className="bi bi-tag me-2"></i>Gênero:</strong> {filme.genero}
                            </p>
                        </div>
                        <div className="col-md-6">
                            <p>
                                <strong><i className="bi bi-clock me-2"></i>Duração:</strong> {filme.duracao} minutos
                            </p>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <p>
                                <strong><i className="bi bi-calendar-check me-2"></i>Início de Exibição:</strong> {formatDate(filme.dataInicioExibicao)}
                            </p>
                        </div>
                        <div className="col-md-6">
                            <p>
                                <strong><i className="bi bi-calendar-x me-2"></i>Fim de Exibição:</strong> {formatDate(filme.dataFinalExibicao)}
                            </p>
                        </div>
                    </div>

                    <div className="mb-3">
                        <p>
                            <strong><i className="bi bi-star me-2"></i>Classificação:</strong> 
                            <span className="badge bg-secondary ms-2">{filme.classificacao} anos</span>
                        </p>
                    </div>

                    {filme.elenco && (
                        <div className="mb-3">
                            <p>
                                <strong><i className="bi bi-people me-2"></i>Elenco:</strong> {filme.elenco}
                            </p>
                        </div>
                    )}

                    <div className="mb-3">
                        <strong><i className="bi bi-file-text me-2"></i>Sinopse:</strong>
                        <p className="mt-2">{filme.sinopse}</p>
                    </div>
                </div>
                <div className="card-footer">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/filmes/${id}/editar`)}
                    >
                        <i className="bi bi-pencil me-1"></i>
                        Editar
                    </button>
                </div>
            </div>
        </div>
    );
};

