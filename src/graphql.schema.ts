/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class Auth {
    email: string;
    password: string;
}

export class CreateBookmark {
    title: string;
    description?: Nullable<string>;
    link: string;
    thumbnail?: Nullable<string>;
}

export class EditBookmark {
    title?: Nullable<string>;
    description?: Nullable<string>;
    link?: Nullable<string>;
    thumbnail?: Nullable<string>;
}

export class EditUser {
    email?: Nullable<string>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
}

export class ChangePassword {
    oldPassword: string;
    newPassword: string;
}

export class AuthResponse {
    access_token: string;
}

export abstract class IMutation {
    abstract signup(dto: Auth): AuthResponse | Promise<AuthResponse>;

    abstract signin(dto: Auth): AuthResponse | Promise<AuthResponse>;

    abstract createBookmark(dto: CreateBookmark): Bookmark | Promise<Bookmark>;

    abstract editBookmarkById(bookmarkId: number, dto: EditBookmark): Nullable<Bookmark> | Promise<Nullable<Bookmark>>;

    abstract deleteBookmarkById(bookmarkId: number): Nullable<Void> | Promise<Nullable<Void>>;

    abstract editUser(dto: EditUser): User | Promise<User>;

    abstract changePassword(dto: ChangePassword): User | Promise<User>;
}

export class Bookmark {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description?: Nullable<string>;
    link: string;
    thumbnail?: Nullable<string>;
    userId: number;
}

export abstract class IQuery {
    abstract getBookmarks(): Nullable<Bookmark[]> | Promise<Nullable<Bookmark[]>>;

    abstract getBookmarkById(bookmarkId: number): Nullable<Bookmark> | Promise<Nullable<Bookmark>>;

    abstract getMe(): User | Promise<User>;
}

export class User {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    hash: string;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
}

export type Void = any;
type Nullable<T> = T | null;
