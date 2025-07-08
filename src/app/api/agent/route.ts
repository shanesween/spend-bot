import { runSpendAgent } from "@/lib/agent";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { prompt } = await req.json();

    if (!prompt) return NextResponse.json({ error: "Missing prompt" }, { status: 400 });

    try {
        const result = await runSpendAgent(prompt);
        return NextResponse.json({ result });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to run agent" }, { status: 500 });
    }
}
