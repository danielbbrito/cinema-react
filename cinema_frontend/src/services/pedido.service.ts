import { type IPedido } from "../models/pedido.model"
import { API_BASE_URL } from "../config/api.config"

const API_ENDPOINT = `${API_BASE_URL}/pedidos`;

export class PedidosService {
    private async request<T>(endpoint: string, options: RequestInit = {}) {
        const URL = API_ENDPOINT + endpoint;

        const defaultHeaders = {
            "Content-Type": "application/json"
        };

        const config: RequestInit = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...(options.headers || {})
            }
        };

        try {
            const response = await fetch(URL, config);

            if (!response.ok) {
                const message = await response.text();
                throw new Error(`Erro na api  ${response.status}: ${message}`);
            }

            return response.status === 204 ? ({} as T) : response.json();
        } catch(error) {
            console.error(`Erro em requisição para ${URL}:`, error);
            throw error;
        }
    }

    async findAll(): Promise<IPedido[]> {
        return this.request<IPedido[]>("", {});
    }

    async findById(id: number | string): Promise<IPedido> {
        return this.request<IPedido>(`/${id}`);
    }

    async create(pedido: Omit<IPedido, "id">): Promise<IPedido> {
        return this.request<IPedido>("", {
            method:"POST",
            body: JSON.stringify(pedido)
        });
    }

    async update(id: string | number, dados: Omit<Partial<IPedido>, "id">) {
        return this.request<IPedido>(`/${id}`, {
            method: "PUT",
            body: JSON.stringify(dados)
        });
    }

    async delete(id: number | string): Promise<void> {
        await this.request<void>(`/${id}`, {
            method: "DELETE"
        });
    }
}

export const pedidosService = new PedidosService();

