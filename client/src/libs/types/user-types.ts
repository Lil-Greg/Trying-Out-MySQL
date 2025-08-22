export type User = {
    id: number
    bio: string,
    email: string,
    meme_id: number | null,
    username: string
}

export type PostUserFormData = {
    bio?: string;
    email: string;
    username: string;
}