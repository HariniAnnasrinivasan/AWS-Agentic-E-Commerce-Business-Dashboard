import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import { NextResponse } from 'next/server';

const client = new BedrockAgentRuntimeClient({
    region: process.env.AWS_REGION || "us-east-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

export async function POST(req: Request) {
    try {
        const { message, sessionId } = await req.json();
        const finalSessionId = sessionId || Math.random().toString(36).substring(7);

        const command = new InvokeAgentCommand({
            agentId: process.env.PRODUCT_AGENT_ID,
            agentAliasId: process.env.PRODUCT_AGENT_ALIAS_ID,
            sessionId: finalSessionId,
            inputText: message,
        });

        const response = await client.send(command);
        let completion = "";

        if (response.completion) {
            for await (const chunk of response.completion) {
                if (chunk.chunk && chunk.chunk.bytes) {
                    completion += new TextDecoder().decode(chunk.chunk.bytes);
                }
            }
        }

        return NextResponse.json({
            response: completion,
            sessionId: finalSessionId
        });

    } catch (error: any) {
        console.error("Bedrock Agent Error:", error);
        return NextResponse.json({ error: error.message || "Failed to communicate with agent" }, { status: 500 });
    }
}
