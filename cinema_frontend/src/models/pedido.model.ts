import z from "zod";

export interface IPedido {
    id: string | number;
    dataHora: Date | string;
    ingressosMeiaQtd: number;
    ingressosInteiraQtd: number;
    ingresso: string | number;
    lancheCombos: (string | number)[];
    valorTotal: number;
    metodoPagamento: string;
}

export const pedidoSchema = z.object({
    id: z.union([z.string(), z.number()])
        .transform(val => Number(val)),
    dataHora: z.date(),
    ingressosMeiaQtd: z.number(),
    ingressosInteiraQtd: z.number(),
    ingresso: z.union([z.string(), z.number()])
        .transform(val => Number(val)),
    lancheCombos: z.array(z.union([z.string(), z.number()])),
    valorTotal: z.number(),
    metodoPagamento: z.string()
});

