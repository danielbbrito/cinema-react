import { useEffect, useState } from "react";
import { ingressoService } from "../../services/ingresso.service";
import { lancheCombosService } from "../../services/lancheCombo.service";
import { pedidosService } from "../../services/pedido.service";
import { type IIngresso } from "../../models/ingresso.model";
import { type ILancheCombo } from "../../models/lancheCombo.model";
import { type ISessao } from "../../models/sessao.model";

interface VendaIngressoModalProps {
    show: boolean;
    sessao: ISessao | null;
    onClose: () => void;
    onSuccess: () => void;
}

export const VendaIngressoModal = ({
    show,
    sessao,
    onClose,
    onSuccess
}: VendaIngressoModalProps) => {
    const [ingresso, setIngresso] = useState<IIngresso | null>(null);
    const [lancheCombos, setLancheCombos] = useState<ILancheCombo[]>([]);
    const [formData, setFormData] = useState({
        quantidadeInteira: 0,
        quantidadeMeia: 0,
        lancheComboId: "",
        metodoPagamento: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (show && sessao) {
            loadIngressoELanches();
        }
    }, [show, sessao]);

    const loadIngressoELanches = async () => {
        if (!sessao) return;
        try {
            // Buscar ingresso da sessão (usando endpoint singular "ingresso")
            const ingressos = await ingressoService.findAll();
            const ingressoSessao = ingressos.find(i => String(i.sessao) === String(sessao.id));
            
            if (!ingressoSessao) {
                setError("Ingresso não encontrado para esta sessão");
                return;
            }

            setIngresso(ingressoSessao);
            
            // Buscar lanche combos
            const combos = await lancheCombosService.findAll();
            setLancheCombos(combos);
            
            // Resetar form
            setFormData({
                quantidadeInteira: 0,
                quantidadeMeia: 0,
                lancheComboId: "",
                metodoPagamento: ""
            });
            setError(null);
        } catch (err) {
            setError("Erro ao carregar dados");
            console.error(err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleQuantidadeChange = (tipo: "inteira" | "meia", value: number) => {
        if (value < 0) return;
        if (tipo === "inteira") {
            setFormData(prev => ({
                ...prev,
                quantidadeInteira: value
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                quantidadeMeia: value
            }));
        }
    };

    const calcularValorTotal = (): number => {
        if (!ingresso) return 0;
        
        let total = 0;
        
        // Valor dos ingressos inteiros
        total += formData.quantidadeInteira * ingresso.valorInteira;
        
        // Valor dos ingressos meia
        total += formData.quantidadeMeia * ingresso.valorMeia;
        
        // Valor do lanche combo (se selecionado)
        if (formData.lancheComboId) {
            const combo = lancheCombos.find(c => String(c.id) === formData.lancheComboId);
            if (combo) {
                total += combo.subtotal;
            }
        }
        
        return total;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!sessao || !ingresso) {
            setError("Dados da sessão ou ingresso inválidos");
            setLoading(false);
            return;
        }

        if (formData.quantidadeInteira === 0 && formData.quantidadeMeia === 0) {
            setError("Selecione pelo menos um ingresso");
            setLoading(false);
            return;
        }

        if (!formData.metodoPagamento) {
            setError("Selecione um método de pagamento");
            setLoading(false);
            return;
        }

        try {
            // Criar o pedido
            const valorTotal = calcularValorTotal();
            const lancheCombosIds = formData.lancheComboId 
                ? [Number(formData.lancheComboId)] 
                : [];

            const pedidoData = {
                dataHora: new Date(),
                ingressosMeiaQtd: formData.quantidadeMeia,
                ingressosInteiraQtd: formData.quantidadeInteira,
                ingresso: ingresso.id,
                lancheCombos: lancheCombosIds,
                valorTotal: valorTotal,
                metodoPagamento: formData.metodoPagamento
            };

            await pedidosService.create(pedidoData);
            onSuccess();
            onClose();
        } catch (err) {
            setError("Erro ao processar venda");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <>
            <div 
                className="modal fade show"
                style={{ display: "block" }}
                tabIndex={-1}
                role="dialog"
                aria-labelledby="vendaIngressoModalLabel"
                aria-modal="true"
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        onClose();
                    }
                }}
            >
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="vendaIngressoModalLabel">
                                <i className="bi bi-ticket-perforated me-2"></i>
                                Vender Ingresso
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={onClose}
                            ></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                {ingresso && (
                                    <>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="quantidadeInteira" className="form-label">
                                                    Ingressos Inteiros - R$ {ingresso.valorInteira.toFixed(2)}
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="quantidadeInteira"
                                                    min="0"
                                                    value={formData.quantidadeInteira}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value) || 0;
                                                        handleQuantidadeChange("inteira", value);
                                                    }}
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="quantidadeMeia" className="form-label">
                                                    Ingressos Meia - R$ {ingresso.valorMeia.toFixed(2)}
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="quantidadeMeia"
                                                    min="0"
                                                    value={formData.quantidadeMeia}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value) || 0;
                                                        handleQuantidadeChange("meia", value);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="lancheComboId" className="form-label">
                                                Lanche Combo (Opcional)
                                            </label>
                                            <select
                                                className="form-select"
                                                id="lancheComboId"
                                                name="lancheComboId"
                                                value={formData.lancheComboId}
                                                onChange={handleChange}
                                            >
                                                <option value="">Nenhum</option>
                                                {lancheCombos.map((combo) => (
                                                    <option key={String(combo.id)} value={String(combo.id)}>
                                                        {combo.nome} - R$ {combo.subtotal.toFixed(2)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="metodoPagamento" className="form-label">
                                                Método de Pagamento <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className="form-select"
                                                id="metodoPagamento"
                                                name="metodoPagamento"
                                                value={formData.metodoPagamento}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Selecione um método</option>
                                                <option value="cartão de crédito">Cartão de crédito</option>
                                                <option value="cartão de débito">Cartão de débito</option>
                                                <option value="dinheiro">Dinheiro</option>
                                                <option value="PIX">PIX</option>
                                            </select>
                                        </div>

                                        <div className="alert alert-info">
                                            <strong>Valor Total: R$ {calcularValorTotal().toFixed(2)}</strong>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading || !ingresso}
                                >
                                    <i className="bi bi-check-circle me-1"></i>
                                    {loading ? "Processando..." : "Confirmar Venda"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div 
                className="modal-backdrop fade show"
                onClick={onClose}
            ></div>
        </>
    );
};

