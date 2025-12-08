import z from "zod";

export interface IFilme {
    id: string | number;
    titulo: string;
    sinopse: string;
    classificacao: string;
    duracao: number;
    elenco: string;
    genero: string;
    dataInicioExibicao: Date | string;
    dataFinalExibicao: Date | string;
}

export const filmeSchema = z.object({
    id: z.union([z.string(), z.number()])
        .transform(val => Number(val)),
    titulo: z.string()
        .min(1, "Título é obrigatório"),
    sinopse: z.string()
        .min(10, "Sinopse deve ter pelo menos 10 caracteres"),
    classificacao: z.string(),
    duracao: z.number()
        .min(1, "Duração deve ser maior que zero"),
    elenco: z.string(),
    genero: z.string(),
    dataInicioExibicao: z.date(),
    dataFinalExibicao: z.date()
});
