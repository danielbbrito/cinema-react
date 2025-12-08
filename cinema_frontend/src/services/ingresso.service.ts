import { type IIngresso } from "../models/ingresso.model"

const API_BASE_URL = "http://localhost:3000/ingresso";

export class IngressoService {
    private async request<T>(endpoint: string, options: RequestInit = {}) {
        const URL = API_BASE_URL + endpoint;

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

    async findAll(): Promise<IIngresso[]> {
        return this.request<IIngresso[]>("", {});
    }

    async findById(id: number | string): Promise<IIngresso> {
        return this.request<IIngresso>(`/${id}`);
    }

    async create(ingresso: Omit<IIngresso, "id">): Promise<IIngresso> {
        return this.request<IIngresso>("", {
            method:"POST",
            body: JSON.stringify(ingresso)
        });
    }

    async update(id: string | number, dados: Omit<Partial<IIngresso>, "id">) {
        return this.request<IIngresso>(`/${id}`, {
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

export const ingressoService = new IngressoService();
