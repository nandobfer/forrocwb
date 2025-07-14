import { Prisma } from "@prisma/client";
import { Band } from "./Band";
import { Artist } from "./Artist";
export declare const event_include: {
    bands: {
        include: {
            artists: true;
        };
    };
    artists: true;
};
export type EventPrisma = Prisma.EventGetPayload<{
    include: typeof event_include;
}>;
export type EventForm = Omit<Event, "id">;
export interface Location {
    street: string;
    district: string;
    number: string;
    cep: string;
    complement: string;
}
export declare class Event {
    id: string;
    title: string;
    description: string;
    datetime: string;
    price: number;
    location: Location;
    week: number;
    bands: Band[];
    artists: Artist[];
    static getWeek(week: number | string): Promise<Event[]>;
    static getCurrentWeek(): Promise<Event[]>;
    static getAll(): Promise<Event[]>;
    static findById(id: string): Promise<Event | null>;
    static new(data: EventForm): Promise<Event>;
    constructor(data: EventPrisma);
    load(data: EventPrisma): void;
    update(data: Partial<EventForm>): Promise<void>;
    delete(): Promise<boolean>;
}
