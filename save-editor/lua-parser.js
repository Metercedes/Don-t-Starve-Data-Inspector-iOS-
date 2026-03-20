const LuaParser = (() => {

    const T = {
        EOF: "EOF", LBRACE: "{", RBRACE: "}", LBRACKET: "[", RBRACKET: "]",
        EQUALS: "=", COMMA: ",", STRING: "STRING", NUMBER: "NUMBER",
        BOOLEAN: "BOOLEAN", IDENTIFIER: "IDENTIFIER", EXPRESSION: "EXPRESSION",
    };

    class Lexer {
        constructor(str) {
            this.str = str;
            this.pos = 0;
            this.len = str.length;
        }

        peek() {
            return this.pos < this.len ? this.str[this.pos] : null;
        }

        advance() {
            return this.str[this.pos++];
        }

        skipWhitespace() {
            while (this.pos < this.len) {
                const c = this.str[this.pos];
                if (c === " " || c === "\t" || c === "\n" || c === "\r") {
                    this.pos++;
                } else if (c === "-" && this.pos + 1 < this.len && this.str[this.pos + 1] === "-") {
                    this.pos += 2;
                    if (this.pos < this.len && this.str[this.pos] === "[" && this.pos + 1 < this.len && this.str[this.pos + 1] === "[") {
                        this.pos += 2;
                        while (this.pos + 1 < this.len) {
                            if (this.str[this.pos] === "]" && this.str[this.pos + 1] === "]") {
                                this.pos += 2;
                                break;
                            }
                            this.pos++;
                        }
                    } else {
                        while (this.pos < this.len && this.str[this.pos] !== "\n") {
                            this.pos++;
                        }
                    }
                } else {
                    break;
                }
            }
        }

        nextToken() {
            this.skipWhitespace();

            if (this.pos >= this.len) return { type: T.EOF };

            const c = this.peek();

            if (c === "{") { this.advance(); return { type: T.LBRACE }; }
            if (c === "}") { this.advance(); return { type: T.RBRACE }; }
            if (c === "[") { this.advance(); return { type: T.LBRACKET }; }
            if (c === "]") { this.advance(); return { type: T.RBRACKET }; }
            if (c === "=") { this.advance(); return { type: T.EQUALS }; }
            if (c === ",") { this.advance(); return { type: T.COMMA }; }

            if (c === '"') {
                return this.readString();
            }

            if (this.isDigit(c) || c === "." || (c === "-" && this.pos + 1 < this.len && (this.isDigit(this.str[this.pos + 1]) || this.str[this.pos + 1] === "."))) {
                return this.readNumber();
            }

            if (this.isAlpha(c)) {
                return this.readIdentifier();
            }

            throw new Error(`Unexpected character '${c}' at position ${this.pos}`);
        }

        readString() {
            this.advance();
            let str = "";
            while (this.pos < this.len) {
                const c = this.advance();
                if (c === "\\") {
                    if (this.pos >= this.len) { str += "\\"; break; }
                    const next = this.advance();
                    if (next === '"') str += '"';
                    else if (next === "n") str += "\n";
                    else if (next === "t") str += "\t";
                    else if (next === "r") str += "\r";
                    else if (next === "\\") str += "\\";
                    else if (next === "a") str += "\x07";
                    else if (next === "b") str += "\b";
                    else if (next === "f") str += "\f";
                    else if (next === "v") str += "\v";
                    else if (next === "0") str += "\0";
                    else str += "\\" + next;
                } else if (c === '"') {
                    return { type: T.STRING, value: str };
                } else {
                    str += c;
                }
            }
            throw new Error("Unterminated string");
        }

        readNumber() {
            let numStr = "";
            let isFloat = false;

            if (this.peek() === "-") {
                numStr += this.advance();
            }

            while (this.pos < this.len) {
                const c = this.peek();
                if (this.isDigit(c)) {
                    numStr += this.advance();
                } else if (c === "." && !isFloat) {
                    isFloat = true;
                    numStr += this.advance();
                } else if (c === "e" || c === "E") {
                    isFloat = true;
                    numStr += this.advance();
                    if (this.peek() === "-" || this.peek() === "+") {
                        numStr += this.advance();
                    }
                } else {
                    break;
                }
            }

            const value = isFloat ? parseFloat(numStr) : parseInt(numStr, 10);
            return { type: T.NUMBER, value, isFloat, raw: numStr };
        }

        readIdentifier() {
            let id = "";
            while (this.pos < this.len && (this.isAlnum(this.peek()) || this.peek() === "_")) {
                id += this.advance();
            }

            this.skipWhitespace();
            if (this.peek() === "(") {
                let expr = id;
                expr += this.advance();
                let depth = 1;
                while (this.pos < this.len && depth > 0) {
                    const c = this.advance();
                    expr += c;
                    if (c === "(") depth++;
                    else if (c === ")") depth--;
                    else if (c === '"') {
                        while (this.pos < this.len) {
                            const sc = this.advance();
                            expr += sc;
                            if (sc === '"') break;
                            if (sc === "\\" && this.pos < this.len) {
                                expr += this.advance();
                            }
                        }
                    }
                }
                return { type: T.EXPRESSION, value: expr };
            }

            if (id === "true") return { type: T.BOOLEAN, value: true };
            if (id === "false") return { type: T.BOOLEAN, value: false };
            if (id === "nil") return { type: T.IDENTIFIER, value: "nil", isNil: true };

            return { type: T.IDENTIFIER, value: id };
        }

        isDigit(c) { return c >= "0" && c <= "9"; }
        isAlpha(c) { return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_"; }
        isAlnum(c) { return this.isDigit(c) || this.isAlpha(c); }
    }

    function parse(str) {
        const lexer = new Lexer(str);
        const token = lexer.nextToken();
        if (token.type === T.LBRACE) {
            return parseTable(lexer);
        }
        return tokenToValue(token);
    }

    function parseTable(lexer) {
        const entries = [];
        let autoIndex = 1;

        while (true) {
            const token = lexer.nextToken();

            if (token.type === T.RBRACE || token.type === T.EOF) break;
            if (token.type === T.COMMA) continue;

            if (token.type === T.LBRACKET) {
                const keyToken = lexer.nextToken();
                const closeBracket = lexer.nextToken();
                if (closeBracket.type !== T.RBRACKET) throw new Error("Expected ']'");
                const eq = lexer.nextToken();
                if (eq.type !== T.EQUALS) throw new Error("Expected '='");
                const valueToken = lexer.nextToken();
                const value = valueToken.type === T.LBRACE ? parseTable(lexer) : tokenToValue(valueToken);

                if (keyToken.type === T.STRING) {
                    entries.push({ keyType: "string_index", key: keyToken.value, value });
                } else {
                    entries.push({ keyType: "numeric_index", key: keyToken.value, value });
                }
                continue;
            }

            if (token.type === T.IDENTIFIER && !token.isNil) {
                const next = lexer.nextToken();
                if (next.type === T.EQUALS) {
                    const valueToken = lexer.nextToken();
                    const value = valueToken.type === T.LBRACE ? parseTable(lexer) : tokenToValue(valueToken);
                    entries.push({ keyType: "named", key: token.value, value });
                    continue;
                }
                if (next.type === T.COMMA || next.type === T.RBRACE) {
                    entries.push({ keyType: "auto", key: autoIndex++, value: tokenToValue(token) });
                    if (next.type === T.RBRACE) break;
                    continue;
                }
            }

            if (token.type === T.LBRACE) {
                const value = parseTable(lexer);
                entries.push({ keyType: "auto", key: autoIndex++, value });
                continue;
            }

            const value = tokenToValue(token);
            entries.push({ keyType: "auto", key: autoIndex++, value });
        }

        return { __luaTable: true, entries };
    }

    function tokenToValue(token) {
        if (token.type === T.STRING) return { type: "string", value: token.value };
        if (token.type === T.NUMBER) return { type: "number", value: token.value, isFloat: token.isFloat, raw: token.raw };
        if (token.type === T.BOOLEAN) return { type: "boolean", value: token.value };
        if (token.type === T.EXPRESSION) return { type: "expression", value: token.value };
        if (token.type === T.IDENTIFIER) {
            if (token.isNil) return { type: "nil" };
            return { type: "expression", value: token.value };
        }
        throw new Error("Unexpected token type: " + token.type);
    }

    function serialize(obj, indent) {
        if (indent === undefined) indent = null;

        if (!obj) return "nil";

        if (obj.__luaTable) {
            return serializeTable(obj, indent, indent !== null ? 0 : -1);
        }

        if (obj.type === "string") return '"' + escapeString(obj.value) + '"';
        if (obj.type === "number") return formatNumber(obj.value, obj.isFloat);
        if (obj.type === "boolean") return obj.value ? "true" : "false";
        if (obj.type === "expression") return obj.value;
        if (obj.type === "nil") return "nil";

        return String(obj);
    }

    function serializeTable(table, indent, level) {
        const compact = level < 0;
        const entries = table.entries;
        if (entries.length === 0) return "{  }";

        let parts = [];
        for (const entry of entries) {
            let prefix = "";
            if (entry.keyType === "named") {
                prefix = entry.key + "=";
            } else if (entry.keyType === "string_index") {
                prefix = '["' + escapeString(entry.key) + '"]=';
            } else if (entry.keyType === "numeric_index") {
                prefix = "[" + entry.key + "]=";
            }

            const val = entry.value.__luaTable
                ? serializeTable(entry.value, indent, compact ? -1 : level + 1)
                : serialize(entry.value);

            parts.push(prefix + val);
        }

        if (compact) return "{ " + parts.join(", ") + " }";

        const allSimple = entries.every(e => !e.value.__luaTable && e.keyType === "auto");
        if (allSimple && parts.join(", ").length < 80) {
            return "{ " + parts.join(", ") + " }";
        }

        const pad = " ".repeat((level + 1) * indent);
        const closePad = " ".repeat(level * indent);
        return "{\n" + parts.map(p => pad + p).join(",\n") + " \n" + closePad + "}";
    }

    function escapeString(s) {
        return s
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"')
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t")
            .replace(/\0/g, "\\0");
    }

    function formatNumber(value, isFloat) {
        if (!isFloat && Number.isInteger(value)) return String(value);
        if (Math.abs(value) < 0.1 && value !== 0) return value.toExponential(13);
        let s = value.toPrecision(15);
        if (s.includes(".")) {
            s = s.replace(/0+$/, "");
            if (s.endsWith(".")) s = s.slice(0, -1);
        }
        return s;
    }

    function findValue(table, path) {
        const keys = path.split(".");
        let current = table;

        for (const key of keys) {
            if (!current || !current.__luaTable) return null;
            const entry = current.entries.find(e => e.key === key || e.key === parseInt(key));
            if (!entry) return null;
            current = entry.value;
        }

        return current;
    }

    function setValue(table, path, newValue) {
        const keys = path.split(".");
        const lastKey = keys.pop();
        let current = table;

        for (const key of keys) {
            if (!current || !current.__luaTable) return false;
            const entry = current.entries.find(e => e.key === key || e.key === parseInt(key));
            if (!entry) return false;
            current = entry.value;
        }

        if (!current || !current.__luaTable) return false;
        const entry = current.entries.find(e => e.key === lastKey || e.key === parseInt(lastKey));
        if (!entry) {
            current.entries.push({ keyType: "named", key: lastKey, value: newValue });
            return true;
        }
        entry.value = newValue;
        return true;
    }

    function getKeys(table) {
        if (!table || !table.__luaTable) return [];
        return table.entries.map(e => e.key);
    }

    function serializeSave(table, indent) {
        return "return " + serialize(table, indent);
    }

    function prettyPrint(table) {
        return serialize(table, 2);
    }

    return {
        parse, serialize, serializeSave, prettyPrint,
        findValue, setValue, getKeys,
    };
})();
