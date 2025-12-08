import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sessoesService } from "../../services/sessao.service";
import { filmesService } from "../../services/filme.service";
import { salasService } from "../../services/sala.service";
import { type ISessao } from "../../models/sessao.model";
import { type IFilme } from "../../models/filme.model";
import { type ISala } from "../../models/sala.model";

export const SessaoFormPages = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        filme: "",
        sala: "",
        horario: ""
    });

    const [filmes, setFilmes] = useState<IFilme[]>([]);
    const [salas, setSalas] = useState<ISala[]>([]);
    const [filmeSelecionado, setFilmeSelecionado] = useState<IFilme | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadFilmesESalas();
        if (isEdit && id) {
            loadSessao();
        }
    }, [id]);

    useEffect(() => {
        if (formData.filme && filmes.length > 0) {
            const filme = filmes.find(f => String(f.id) === formData.filme);
            setFilmeSelecionado(filme || null);
        } else {
            setFilmeSelecionado(null);
        }
    }, [formData.filme, filmes]);

    const loadFilmesESalas = async () => {
        try {
            const [filmesData, salasData] = await Promise.all([
                filmesService.findAll(),
                salasService.findAll()
            ]);
            setFilmes(filmesData);
            setSalas(salasData);
        } catch (err) {
            setError("Erro ao carregar filmes e salas");
            console.error(err);
        }
    };

    const loadSessao = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const sessao = await sessoesService.findById(id);
            
            // Converter data para formato input datetime-local
            const formatDateForInput = (date: Date | string) => {
                const d = typeof date === 'string' ? new Date(date) : date;
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                const hours = String(d.getHours()).padStart(2, '0');
                const minutes = String(d.getMinutes()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}`;
            };

            setFormData({
                filme: String(sessao.filme),
                sala: String(sessao.sala),
                horario: formatDateForInput(sessao.horario)
            });
            setError(null);
        } catch (err) {
            setError("Erro ao carregar sessão");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getMinDateTime = (): string => {
        const agora = new Date();
        
        if (!filmeSelecionado) {
            // Se não há filme selecionado, retorna a data atual
            const year = agora.getFullYear();
            const month = String(agora.getMonth() + 1).padStart(2, '0');
            const day = String(agora.getDate()).padStart(2, '0');
            const hours = String(agora.getHours()).padStart(2, '0');
            const minutes = String(agora.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        }
        
        const inicio = typeof filmeSelecionado.dataInicioExibicao === 'string' 
            ? new Date(filmeSelecionado.dataInicioExibicao) 
            : filmeSelecionado.dataInicioExibicao;
        
        // Usar a data mais recente entre a data atual e a data de início do filme
        const dataMinima = inicio > agora ? inicio : agora;
        
        const year = dataMinima.getFullYear();
        const month = String(dataMinima.getMonth() + 1).padStart(2, '0');
        const day = String(dataMinima.getDate()).padStart(2, '0');
        const hours = String(dataMinima.getHours()).padStart(2, '0');
        const minutes = String(dataMinima.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const getMaxDateTime = (): string => {
        if (!filmeSelecionado) return "";
        const fim = typeof filmeSelecionado.dataFinalExibicao === 'string' 
            ? new Date(filmeSelecionado.dataFinalExibicao) 
            : filmeSelecionado.dataFinalExibicao;
        
        const year = fim.getFullYear();
        const month = String(fim.getMonth() + 1).padStart(2, '0');
        const day = String(fim.getDate()).padStart(2, '0');
        const hours = String(fim.getHours()).padStart(2, '0');
        const minutes = String(fim.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.filme || !formData.sala || !formData.horario) {
            setError("Todos os campos são obrigatórios");
            setLoading(false);
            return;
        }

        if (!filmeSelecionado) {
            setError("Filme inválido");
            setLoading(false);
            return;
        }

        const horarioSelecionado = new Date(formData.horario);
        const agora = new Date();
        
        // Verificar se a data não é anterior à data atual
        if (horarioSelecionado < agora) {
            setError("A data e hora da sessão não pode ser anterior à data e hora atual");
            setLoading(false);
            return;
        }

        const dataInicio = typeof filmeSelecionado.dataInicioExibicao === 'string' 
            ? new Date(filmeSelecionado.dataInicioExibicao) 
            : filmeSelecionado.dataInicioExibicao;
        const dataFim = typeof filmeSelecionado.dataFinalExibicao === 'string' 
            ? new Date(filmeSelecionado.dataFinalExibicao) 
            : filmeSelecionado.dataFinalExibicao;

        // A data mínima deve ser a mais recente entre agora e o início do filme
        const dataMinima = dataInicio > agora ? dataInicio : agora;

        if (horarioSelecionado < dataMinima || horarioSelecionado > dataFim) {
            setError(`A data e hora da sessão deve estar entre ${dataMinima.toLocaleString('pt-BR')} e ${dataFim.toLocaleString('pt-BR')}`);
            setLoading(false);
            return;
        }

        try {
            const sessaoData: Omit<ISessao, "id"> = {
                horario: horarioSelecionado,
                filme: formData.filme,
                sala: formData.sala
            };

            if (isEdit && id) {
                await sessoesService.update(id, sessaoData);
            } else {
                await sessoesService.create(sessaoData);
            }

            navigate("/sessoes");
        } catch (err) {
            setError("Erro ao salvar sessão");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit) {
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

    return (
        <div className="container mt-4">
            <h2>
                <i className="bi bi-calendar-event me-2"></i>
                {isEdit ? "Editar Sessão" : "Nova Sessão"}
            </h2>

            {error && (
                <div className="alert alert-danger mt-3" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="filme" className="form-label">
                            Filme <span className="text-danger">*</span>
                        </label>
                        <select
                            className="form-select"
                            id="filme"
                            name="filme"
                            value={formData.filme}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione um filme</option>
                            {filmes.map((filme) => (
                                <option key={String(filme.id)} value={String(filme.id)}>
                                    {filme.titulo}
                                </option>
                            ))}
                        </select>
                        {filmeSelecionado && (
                            <small className="form-text text-muted">
                                Período de exibição: {new Date(filmeSelecionado.dataInicioExibicao).toLocaleDateString('pt-BR')} até {new Date(filmeSelecionado.dataFinalExibicao).toLocaleDateString('pt-BR')}
                            </small>
                        )}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="sala" className="form-label">
                            Sala <span className="text-danger">*</span>
                        </label>
                        <select
                            className="form-select"
                            id="sala"
                            name="sala"
                            value={formData.sala}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione uma sala</option>
                            {salas.map((sala) => (
                                <option key={String(sala.id)} value={String(sala.id)}>
                                    Sala {sala.numero} - Capacidade: {sala.capacidade}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-12 mb-3">
                        <label htmlFor="horario" className="form-label">
                            Data e Hora da Sessão <span className="text-danger">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            id="horario"
                            name="horario"
                            value={formData.horario}
                            onChange={handleChange}
                            min={getMinDateTime()}
                            max={getMaxDateTime()}
                            required
                            disabled={!filmeSelecionado}
                        />
                        {!filmeSelecionado && (
                            <small className="form-text text-muted">
                                Selecione um filme primeiro para definir o período disponível
                            </small>
                        )}
                        {filmeSelecionado && (
                            <small className="form-text text-muted">
                                A data deve estar entre o período de exibição do filme selecionado
                            </small>
                        )}
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        type="submit"
                        className="btn btn-primary me-2"
                        disabled={loading || !filmeSelecionado}
                    >
                        <i className="bi bi-save me-1"></i>
                        {loading ? "Salvando..." : "Salvar"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/sessoes")}
                    >
                        <i className="bi bi-x-circle me-1"></i>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

