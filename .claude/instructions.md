# Token Efficiency Instructions

## Core Principles
- Be concise and direct in all responses
- Use bullet points over paragraphs
- Skip verbose explanations unless requested

## File Operations
1. **Reading Files**: Use `offset` & `limit` parameters to read only relevant sections
2. **Before Reading**: Use Grep to find exact locations first
3. **Avoid Redundancy**: Don't re-read files unnecessarily - trust previous reads
4. **Parallel Operations**: Batch multiple tool calls in single messages when possible

## Background Processes
- Kill background processes immediately when done
- Don't leave dev servers running unless actively testing

## Communication Style
- Short summaries with key bullet points
- Use emojis sparingly (only when user requests)
- Link to files using markdown format: [filename.ts:line](path/to/file.ts#Lline)

## When to Use TodoWrite
- Only for multi-step tasks (3+ steps)
- Skip for simple, single-step operations
- Clean up stale todos regularly
