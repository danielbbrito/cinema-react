import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { lancheCombosService } from "../../services/lancheCombo.service";
import { type ILancheCombo } from "../../models/lancheCombo.model";

export const LancheComboFormPages = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        nome: "",
        descricao: "",
        valorUnitario: "",
        qtUnidade: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEdit && id) {
            loadLancheCombo();
        }
    }, [id]);

    const loadLancheCombo = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const combo = await lancheCombosService.findById(id);
            setFormData({
                nome: combo.nome,
                descricao: combo.descricao,
                valorUnitario: String(combo.valorUnitario),
                qtUnidade: String(combo.qtUnidade)
            });
            setError(null);
        } catch (err) {
            setError("Erro ao carregar lanche combo");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

        if (!formData.nome.trim()) {
            setError("Nome é obrigatório");
            setLoading(false);
            return;
        }

        if (!formData.descricao.trim()) {
            setError("Descrição é obrigatória");
            setLoading(false);
            return;
        }

        const valorUnitario = Number(formData.valorUnitario);
        const qtUnidade = Number(formData.qtUnidade);

        if (valorUnitario <= 0) {
            setError("Valor unitário deve ser maior que zero");
            setLoading(false);
            return;
        }

        if (qtUnidade <= 0) {
            setError("Quantidade deve ser maior que zero");
            setLoading(false);
            return;
        }

        const subtotal = valorUnitario * qtUnidade;

        try {
            if (isEdit && id) {
                const comboData: Partial<ILancheCombo> = {
                    nome: formData.nome.trim(),
                    descricao: formData.descricao.trim(),
                    valorUnitario: valorUnitario,
                    qtUnidade: qtUnidade,
                    subtotal: subtotal
                };
                await lancheCombosService.update(id, comboData);
            } else {
                const comboData: Omit<ILancheCombo, "id"> = {
                    nome: formData.nome.trim(),
                    descricao: formData.descricao.trim(),
                    valorUnitario: valorUnitario,
                    qtUnidade: qtUnidade,
                    subtotal: subtotal
                };
                await lancheCombosService.create(comboData);
            }
            navigate("/lancheCombos");
        } catch (err) {
            setError("Erro ao salvar lanche combo");
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

    const valorUnitario = Number(formData.valorUnitario) || 0;
    const qtUnidade = Number(formData.qtUnidade) || 0;
    const subtotalCalculado = valorUnitario * qtUnidade;

    return (
        <div className="container mt-4">
            <h2>
                <i className="bi bi-cup-hot me-2"></i>
                {isEdit ? "Editar Lanche Combo" : "Novo Lanche Combo"}
            </h2>

            {error && (
                <div className="alert alert-danger mt-3" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="nome" className="form-label">
                            Nome <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Combo Pipoca + Refrigerante"
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="valorUnitario" className="form-label">
                            Valor Unitário (R$) <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="valorUnitario"
                            name="valorUnitario"
                            value={formData.valorUnitario}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                            placeholder="Ex: 15.50"
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="descricao" className="form-label">
                        Descrição <span className="text-danger">*</span>
                    </label>
                    <textarea
                        className="form-control"
                        id="descricao"
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        rows={3}
                        required
                        placeholder="Descreva o conteúdo do combo..."
                    />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="qtUnidade" className="form-label">
                            Quantidade <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="qtUnidade"
                            name="qtUnidade"
                            value={formData.qtUnidade}
                            onChange={handleChange}
                            min="1"
                            required
                            placeholder="Ex: 1, 2, 3..."
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">
                            Subtotal (calculado automaticamente)
                        </label>
                        <div className="form-control bg-light">
                            <strong>R$ {subtotalCalculado.toFixed(2)}</strong>
                        </div>
                        <small className="form-text text-muted">
                            Subtotal = Valor Unitário × Quantidade
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
                        onClick={() => navigate("/lancheCombos")}
                    >
                        <i className="bi bi-x-circle me-1"></i>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

