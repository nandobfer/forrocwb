import { Prisma } from "@prisma/client";
import { Band } from "./Band";
import { Event } from "./Event";
import { UploadedFile } from "express-fileupload";
export type ArtistPrisma = Prisma.ArtistGetPayload<{}>;
export interface ArtistForm {
    name: string;
    description?: string;
    image?: string;
    instagram?: string;
    birthdate?: string;
}
export declare class Artist {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    instagram: string | null;
    birthdate: string | null;
    static new(data: ArtistForm): Promise<Artist>;
    static getAll(): Promise<Artist[]>;
    static findById(id: string): Promise<Artist | null>;
    constructor(data: ArtistPrisma);
    load(data: ArtistPrisma): void;
    update(data: Partial<ArtistForm>): Promise<void>;
    updateImage(file: UploadedFile): Promise<string>;
    getBands(): Promise<Band[]>;
    getEvents(): Promise<Event[]>;
    delete(): Promise<boolean>;
}
