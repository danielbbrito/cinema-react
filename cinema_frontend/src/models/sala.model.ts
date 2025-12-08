import z from "zod";

export interface ISala {
    id: string | number;
    numero: number;
    capacidade: number;
    poltronas: number[][];
}

export const salaSchema = z.object({
    id: z.union([z.string(), z.number()])
        .transform(val => Number(val)),
    numero: z.number(),
    capacidade: z.number(),
    poltronas: z.array(z.array(z.number()))
});

