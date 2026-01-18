import { NextRequest, NextResponse } from 'next/server';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import { v4 as uuidv4 } from 'uuid';

const client = new BedrockAgentRuntimeClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

export async function POST(req: NextRequest) {
    try {
        const { message, sessionId } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const agentId = process.env.BEDROCK_AGENT_ID;
        const agentAliasId = process.env.BEDROCK_AGENT_ALIAS_ID;
        const activeSessionId = sessionId || uuidv4();

        const command = new InvokeAgentCommand({
            agentId,
            agentAliasId,
            sessionId: activeSessionId,
            inputText: message,
        });

        const response = await client.send(command);

        if (!response.completion) {
            return NextResponse.json({ response: "No response from agent." });
        }

        // Process the stream
        let completion = "";
        for await (const chunk of response.completion) {
            if (chunk.chunk && chunk.chunk.bytes) {
                completion += new TextDecoder("utf-8").decode(chunk.chunk.bytes);
            }
        }

        return NextResponse.json({
            response: completion,
            sessionId: activeSessionId // Return DB sessionId for continuity if needed
        });

    } catch (error: any) {
        console.error("Error invoking Bedrock Agent:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
