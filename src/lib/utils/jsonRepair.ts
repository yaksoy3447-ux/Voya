/**
 * A utility to repair truncated or malformed JSON strings, 
 * typically used for streaming AI outputs that might be cut off.
 */
export function repairJson(json: string): string {
  let repaired = json.trim();
  
  // Basic validation - must start with { or [
  if (!repaired.startsWith('{') && !repaired.startsWith('[')) {
    return repaired;
  }

  // 1. Handle unclosed strings
  let inString = false;
  let escaped = false;
  for (let i = 0; i < repaired.length; i++) {
    const char = repaired[i];
    if (char === '"' && !escaped) {
      inString = !inString;
    }
    escaped = char === '\\' && !escaped;
  }
  
  // If we are left inside a string, close it
  if (inString) {
    if (repaired.endsWith('\\')) {
      repaired = repaired.slice(0, -1);
    }
    repaired += '"';
  }

  // 2. Remove trailing junk like extra commas or partial keys at the very end
  // e.g. {"title": "x", "desc":  -> {"title": "x"}
  repaired = repaired.replace(/,\s*"?[\w\s]*"?\s*:?\s*$/, '');

  // 3. Robust stack-based closing of braces and brackets
  const stack: string[] = [];
  let isString = false;
  let isEscaped = false;

  for (let i = 0; i < repaired.length; i++) {
    const char = repaired[i];
    
    if (char === '"' && !isEscaped) {
      isString = !isString;
    } else if (!isString) {
      if (char === '{') {
        stack.push('}');
      } else if (char === '[') {
        stack.push(']');
      } else if (char === '}' || char === ']') {
        if (stack.length > 0 && stack[stack.length - 1] === char) {
          stack.pop();
        }
      }
    }
    isEscaped = (char === '\\' && !isEscaped);
  }

  // Close everything left on the stack in reverse order
  while (stack.length > 0) {
    repaired += stack.pop();
  }

  return repaired;
}
