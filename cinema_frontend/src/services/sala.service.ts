import { type ISala } from "../models/sala.model"

const API_BASE_URL = "http://localhost:3000/salas";

export class SalasService {
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

    async findAll(): Promise<ISala[]> {
        return this.request<ISala[]>("", {});
    }

    async findById(id: number | string): Promise<ISala> {
        return this.request<ISala>(`/${id}`);
    }

    async create(sala: Omit<ISala, "id">): Promise<ISala> {
        return this.request<ISala>("", {
            method:"POST",
            body: JSON.stringify(sala)
        });
    }

    async update(id: string | number, dados: Omit<Partial<ISala>, "id">) {
        return this.request<ISala>(`/${id}`, {
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

export const salasService = new SalasService();

