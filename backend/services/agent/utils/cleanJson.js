export function parseJsonFromLlm(content) {
    if (typeof content !== "string") return content;
    let text = content.trim();
    
    // Strip markdown code fences if present
    if (text.includes("```")) {
        text = text.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
    }
    
    // Extract JSON object if there is surrounding text
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
        text = text.substring(firstBrace, lastBrace + 1);
    }
    
    return JSON.parse(text);
}
