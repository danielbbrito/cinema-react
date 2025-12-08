import { type IFilme } from "../models/filme.model"

const API_BASE_URL = "http://localhost:3000/filmes";

export class FilmesService {
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
                throw new Error(`Erro na api ${response.status}: ${message}`);
            }

            return response.status === 204 ? ({} as T) : response.json();
        } catch(error) {
            console.error(`Erro em requisição para ${URL}:`, error);
            throw error;
        }
    }

    async findAll(): Promise<IFilme[]> {
        return this.request<IFilme[]>("", {});
    }

    async findById(id: number | string): Promise<IFilme> {
        return this.request<IFilme>(`/${id}`);
    }

    async create(filme: Omit<IFilme, "id">): Promise<IFilme> {
        return this.request<IFilme>("", {
            method:"POST",
            body: JSON.stringify(filme)
        });
    }

    async update(id: string | number, dados: Omit<Partial<IFilme>, "id">) {
        return this.request<IFilme>(`/${id}`, {
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

export const filmesService = new FilmesService();

