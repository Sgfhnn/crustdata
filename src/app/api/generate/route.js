import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
    try {
        const { prompt } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            return new Response(JSON.stringify({ error: "Gemini API key is not configured. Please add it to your .env.local file." }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return new Response(JSON.stringify({ message: text }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return new Response(JSON.stringify({ error: "Failed to generate outreach message" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
