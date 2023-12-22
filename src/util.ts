export function unicodeToBase64(inputString: string): string {
    const utf8Bytes = encodeURIComponent(inputString).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
    );
    const base64String = btoa(utf8Bytes);
    return base64String;
}

export function Base64ToUnicode(base64String: string): string {
    const utf8Bytes = atob(base64String);
    const decodedString = decodeURIComponent(
        utf8Bytes
            .split('')
            .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join('')
    );
    return decodedString;
}

export function hexToBase64(hexString: string) {
    return btoa(
        hexString
            .match(/\w{2}/g)
            .map(function (a) {
                return String.fromCharCode(parseInt(a, 16));
            })
            .join('')
    );
}

export function base64ToHex(base64String: string): string {
    const binaryString = atob(base64String);
    const hexString = binaryToHex(binaryString);
    return hexString;
}

function binaryToHex(binaryString: string): string {
    return binaryString.replace(/[^\x20-\x7E]/g, '').replace(/(\d{8})/g, function (match) {
        return ('0' + parseInt(match, 2).toString(16)).slice(-2);
    });
}
