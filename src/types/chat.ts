export interface Message {
    sender: "user" | "bot";
    content: string;
    timestamp?: Date;
    id?: string;
}

export interface ChatResponse {
    result: string;
    error?: string;
} 