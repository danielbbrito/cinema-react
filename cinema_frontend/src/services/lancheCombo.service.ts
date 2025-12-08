import { type ILancheCombo } from "../models/lancheCombo.model"

const API_BASE_URL = "http://localhost:3000/lancheCombos";

export class LancheCombosService {
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

    async findAll(): Promise<ILancheCombo[]> {
        return this.request<ILancheCombo[]>("", {});
    }

    async findById(id: number | string): Promise<ILancheCombo> {
        return this.request<ILancheCombo>(`/${id}`);
    }

    async create(lancheCombo: Omit<ILancheCombo, "id">): Promise<ILancheCombo> {
        return this.request<ILancheCombo>("", {
            method:"POST",
            body: JSON.stringify(lancheCombo)
        });
    }

    async update(id: string | number, dados: Omit<Partial<ILancheCombo>, "id">) {
        return this.request<ILancheCombo>(`/${id}`, {
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

export const lancheCombosService = new LancheCombosService();

