import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { filmesService } from "../../services/filme.service";
import { type IFilme } from "../../models/filme.model";

export const FilmeFormPages = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        titulo: "",
        sinopse: "",
        classificacao: "",
        duracao: "",
        elenco: "",
        genero: "",
        dataInicioExibicao: "",
        dataFinalExibicao: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEdit) {
            loadFilme();
        }
    }, [id]);

    const loadFilme = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const filme = await filmesService.findById(id);
            
            // Converter datas para formato input datetime-local
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
                titulo: filme.titulo,
                sinopse: filme.sinopse,
                classificacao: filme.classificacao,
                duracao: String(filme.duracao),
                elenco: filme.elenco,
                genero: filme.genero,
                dataInicioExibicao: formatDateForInput(filme.dataInicioExibicao),
                dataFinalExibicao: formatDateForInput(filme.dataFinalExibicao)
            });
            setError(null);
        } catch (err) {
            setError("Erro ao carregar filme");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validações no frontend
        if (!formData.titulo.trim()) {
            setError("Título é obrigatório");
            setLoading(false);
            return;
        }

        if (formData.sinopse.trim().length < 10) {
            setError("Sinopse deve ter pelo menos 10 caracteres");
            setLoading(false);
            return;
        }

        const duracao = Number(formData.duracao);
        if (!duracao || duracao <= 0) {
            setError("Duração é obrigatória e deve ser maior que zero");
            setLoading(false);
            return;
        }

        try {
            const filmeData: Omit<IFilme, "id"> = {
                titulo: formData.titulo.trim(),
                sinopse: formData.sinopse.trim(),
                classificacao: formData.classificacao,
                duracao: duracao,
                elenco: formData.elenco,
                genero: formData.genero,
                dataInicioExibicao: new Date(formData.dataInicioExibicao),
                dataFinalExibicao: new Date(formData.dataFinalExibicao)
            };

            if (isEdit && id) {
                await filmesService.update(id, filmeData);
            } else {
                await filmesService.create(filmeData);
            }

            navigate("/filmes");
        } catch (err) {
            setError("Erro ao salvar filme");
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
                <i className="bi bi-film me-2"></i>
                {isEdit ? "Editar Filme" : "Novo Filme"}
            </h2>

            {error && (
                <div className="alert alert-danger mt-3" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4">
                <div className="row">
                    <div className="col-md-12 mb-3">
                        <label htmlFor="titulo" className="form-label">
                            Título <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="titulo"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            required
                            minLength={1}
                        />
                    </div>

                    <div className="col-md-12 mb-3">
                        <label htmlFor="sinopse" className="form-label">
                            Sinopse <span className="text-danger">*</span>
                        </label>
                        <textarea
                            className="form-control"
                            id="sinopse"
                            name="sinopse"
                            rows={4}
                            value={formData.sinopse}
                            onChange={handleChange}
                            required
                            minLength={10}
                        />
                        <small className="form-text text-muted">
                            Mínimo de 10 caracteres ({formData.sinopse.length}/10)
                        </small>
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="classificacao" className="form-label">
                            Classificação <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="classificacao"
                            name="classificacao"
                            value={formData.classificacao}
                            onChange={handleChange}
                            placeholder="Ex: 16"
                            required
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="duracao" className="form-label">
                            Duração (minutos) <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="duracao"
                            name="duracao"
                            value={formData.duracao}
                            onChange={handleChange}
                            min="1"
                            step="1"
                            required
                        />
                        <small className="form-text text-muted">
                            Deve ser maior que zero
                        </small>
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="genero" className="form-label">
                            Gênero <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="genero"
                            name="genero"
                            value={formData.genero}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="dataInicioExibicao" className="form-label">
                            Data de Início de Exibição <span className="text-danger">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            id="dataInicioExibicao"
                            name="dataInicioExibicao"
                            value={formData.dataInicioExibicao}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="dataFinalExibicao" className="form-label">
                            Data Final de Exibição <span className="text-danger">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            id="dataFinalExibicao"
                            name="dataFinalExibicao"
                            value={formData.dataFinalExibicao}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-12 mb-3">
                        <label htmlFor="elenco" className="form-label">
                            Elenco
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="elenco"
                            name="elenco"
                            value={formData.elenco}
                            onChange={handleChange}
                            placeholder="Ex: Ator 1, Ator 2, Ator 3"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        type="submit"
                        className="btn btn-primary me-2"
                        disabled={loading}
                    >
                        <i className="bi bi-save me-1"></i>
                        {loading ? "Salvando..." : "Salvar"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/filmes")}
                    >
                        <i className="bi bi-x-circle me-1"></i>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

