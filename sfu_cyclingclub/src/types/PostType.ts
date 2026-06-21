export type PostType = {
    pid: number;
    _id: number;
    publish: boolean;
    image: string;
    title: string;
    content: string;
    authorName: string;
    datePosted?: Date;
}