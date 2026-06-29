import { z } from "zod";

export const sendDataUserForPaySchema = z.object({
    fullName: z.string().trim().min(1, "Обязательное поле"),

    phoneNumber: z
        .string()
        .regex(/^\d{9}$/, "Некорректный номер телефона"),

    email: z.string().email({ message: "Неверный формат email" }),
});

export type ISendDataUserForPaySchema = z.infer<
    typeof sendDataUserForPaySchema
>;