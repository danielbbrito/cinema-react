import z from "zod";

export interface ILancheCombo {
    id: string | Number;
    nome: string;
    descricao: string;
    valorUnitario: number;
    qtUnidade: number;
    subtotal: number;
}

export const lancheComboSchema = z.object({
    id: z.union([z.string(), z.number()])
        .transform(val => Number(val)),
    nome: z.string(),
    descricao: z.string(),
    valorUnitario: z.number(),
    qtUnidade: z.number(),
    subtotal: z.number()
});

