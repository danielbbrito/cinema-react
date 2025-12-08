import z from "zod";

export interface ISessao {
    id: string;
    horario: Date | string;
    filme: string;
    sala: string;
}

export const sessaoSchema = z.object({
    id: z.union([z.string(), z.number()])
        .transform(val => Number(val)),
    horario: z.date(),
    filme: z.union([z.string(), z.number()])
           .transform(val => Number(val)),
    
    sala: z.union([z.string(), z.number()])
          .transform(val => Number(val))
})