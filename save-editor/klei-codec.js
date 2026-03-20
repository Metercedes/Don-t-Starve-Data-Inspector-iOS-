const KleiCodec = (() => {
    const HEADER = "KLEI     1D";

    function isKleiFile(data) {
        if (typeof data === "string") {
            return data.startsWith("KLEI     1");
        }
        if (data instanceof Uint8Array) {
            const header = new TextDecoder().decode(data.slice(0, 10));
            return header === "KLEI     1";
        }
        return false;
    }

    function decode(fileBytes) {
        let text;
        if (typeof fileBytes === "string") {
            text = fileBytes;
        } else {
            text = new TextDecoder().decode(fileBytes);
        }

        if (!text.startsWith("KLEI     1")) {
            throw new Error("Not a valid KLEI save file (missing header)");
        }

        const b64Data = text.substring(11);

        const binaryStr = atob(b64Data);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
        }

        if (bytes.length < 16) {
            throw new Error("File too small - corrupted save data");
        }

        const view = new DataView(bytes.buffer);
        const version = view.getUint32(0, true);
        const flags = view.getUint32(4, true);
        const decompressedSize = view.getUint32(8, true);
        const compressedSize = view.getUint32(12, true);

        if (version !== 1) {
            throw new Error("Unsupported save file version: " + version);
        }

        const compressedData = bytes.slice(16);
        let decompressed;
        try {
            decompressed = pako.inflate(compressedData);
        } catch (e) {
            throw new Error("Failed to decompress save data: " + e.message);
        }

        if (decompressed.length !== decompressedSize) {
            console.warn("Decompressed size mismatch: expected " + decompressedSize + ", got " + decompressed.length);
        }

        const decodedText = new TextDecoder().decode(decompressed);

        return {
            version,
            flags,
            decompressedSize,
            compressedSize,
            text: decodedText
        };
    }

    function encode(textContent) {
        const textBytes = new TextEncoder().encode(textContent);
        const compressed = pako.deflate(textBytes);

        const decompressedSize = textBytes.length;
        const compressedSize = compressed.length;

        const header = new Uint8Array(16);
        const headerView = new DataView(header.buffer);
        headerView.setUint32(0, 1, true);
        headerView.setUint32(4, 16, true);
        headerView.setUint32(8, decompressedSize, true);
        headerView.setUint32(12, compressedSize, true);

        const combined = new Uint8Array(16 + compressed.length);
        combined.set(header, 0);
        combined.set(compressed, 16);

        let binaryStr = "";
        for (let i = 0; i < combined.length; i++) {
            binaryStr += String.fromCharCode(combined[i]);
        }
        const b64 = btoa(binaryStr);

        return HEADER + b64;
    }

    function getPayload(decoded) {
        const text = decoded.text;
        if (text.startsWith("{") || text.startsWith("[")) {
            return { type: "json", data: text };
        }
        if (text.startsWith("return ")) {
            return { type: "lua", data: text.substring(7) };
        }
        return { type: "unknown", data: text };
    }

    return { isKleiFile, decode, encode, getPayload };
})();
