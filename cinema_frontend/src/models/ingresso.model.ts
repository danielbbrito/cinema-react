import z from "zod";

export interface IIngresso {
    id: string | number;
    valorInteira: number;
    valorMeia: number;
    sessao: string | number;
}

export const ingressoSchema = z.object({
    id: z.union([z.string(), z.number()])
        .transform(val => Number(val)),
    valorInteira: z.number(),
    valorMeia: z.number(),
    sessao: z.union([z.string(), z.number()])
           .transform(val => Number(val))
});

