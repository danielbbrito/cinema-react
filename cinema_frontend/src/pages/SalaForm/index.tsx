import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { salasService } from "../../services/sala.service";
import { type ISala } from "../../models/sala.model";

export const SalaFormPages = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        numero: "",
        capacidade: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [salasExistentes, setSalasExistentes] = useState<ISala[]>([]);

    useEffect(() => {
        loadSalas();
        if (isEdit && id) {
            loadSala();
        }
    }, [id]);

    const loadSalas = async () => {
        try {
            const data = await salasService.findAll();
            setSalasExistentes(data);
        } catch (err) {
            console.error("Erro ao carregar salas para validação:", err);
        }
    };

    const loadSala = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const sala = await salasService.findById(id);
            setFormData({
                numero: String(sala.numero),
                capacidade: String(sala.capacidade)
            });
            setError(null);
        } catch (err) {
            setError("Erro ao carregar sala");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        const numero = Number(formData.numero);
        const capacidade = Number(formData.capacidade);

        if (numero <= 0) {
            setError("O número da sala deve ser maior que zero");
            setLoading(false);
            return;
        }

        if (capacidade <= 0) {
            setError("A capacidade deve ser maior que zero");
            setLoading(false);
            return;
        }

        // Verificar se já existe uma sala com o mesmo número (apenas na criação ou se mudou o número)
        const salaExistente = salasExistentes.find(sala => 
            sala.numero === numero && (!isEdit || String(sala.id) !== id)
        );
        if (salaExistente) {
            setError(`Já existe uma sala com o número ${numero}. Por favor, escolha outro número.`);
            setLoading(false);
            return;
        }

        try {
            // Criar matriz de poltronas vazia baseada na capacidade
            // Vamos criar uma estrutura simples: tentar fazer fileiras de aproximadamente 6-8 assentos
            const assentosPorFileira = Math.ceil(Math.sqrt(capacidade * 1.5));
            const numFileiras = Math.ceil(capacidade / assentosPorFileira);
            
            const poltronas: number[][] = [];
            let assentosCriados = 0;
            
            for (let i = 0; i < numFileiras && assentosCriados < capacidade; i++) {
                const assentosNestaFileira = Math.min(assentosPorFileira, capacidade - assentosCriados);
                poltronas.push(new Array(assentosNestaFileira).fill(0));
                assentosCriados += assentosNestaFileira;
            }

            if (isEdit && id) {
                // Na edição, manter as poltronas existentes
                const salaExistente = await salasService.findById(id);
                const salaData: Partial<ISala> = {
                    numero: numero,
                    capacidade: capacidade,
                    // Manter poltronas existentes na edição
                    poltronas: salaExistente.poltronas
                };
                await salasService.update(id, salaData);
            } else {
                // Na criação, criar nova estrutura de poltronas
                const salaData: Omit<ISala, "id"> = {
                    numero: numero,
                    capacidade: capacidade,
                    poltronas: poltronas
                };
                await salasService.create(salaData);
            }
            navigate("/salas");
        } catch (err) {
            setError("Erro ao salvar sala");
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
                <i className="bi bi-door-open me-2"></i>
                {isEdit ? "Editar Sala" : "Nova Sala"}
            </h2>

            {error && (
                <div className="alert alert-danger mt-3" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="numero" className="form-label">
                            Número da Sala <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="numero"
                            name="numero"
                            value={formData.numero}
                            onChange={handleChange}
                            min="1"
                            required
                            placeholder="Ex: 1, 2, 3..."
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="capacidade" className="form-label">
                            Capacidade Máxima <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="capacidade"
                            name="capacidade"
                            value={formData.capacidade}
                            onChange={handleChange}
                            min="1"
                            required
                            placeholder="Ex: 30, 50, 100..."
                        />
                        <small className="form-text text-muted">
                            Número máximo de pessoas que a sala pode acomodar
                        </small>
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
                        onClick={() => navigate("/salas")}
                    >
                        <i className="bi bi-x-circle me-1"></i>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

