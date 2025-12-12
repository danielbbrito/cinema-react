import { type ISessao } from "../models/sessao.model"
import { API_BASE_URL } from "../config/api.config"

const API_ENDPOINT = `${API_BASE_URL}/sessoes`;

export class SessoesService {
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

    async findAll(): Promise<ISessao[]> {
        return this.request<ISessao[]>("", {});
    }

    async findById(id: number | string): Promise<ISessao> {
        return this.request<ISessao>(`/${id}`);
    }

    async create(sessao: Omit<ISessao, "id">): Promise<ISessao> {
        return this.request<ISessao>("", {
            method:"POST",
            body: JSON.stringify(sessao)
        });
    }

    async update(id: string | number, dados: Omit<Partial<ISessao>, "id">) {
        return this.request<ISessao>(`/${id}`, {
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

export const sessoesService = new SessoesService();