export function randomColor(fromString: string) {
    let hash = 0;
    for (let i = 0; i < fromString.length; i++) {
        hash = fromString.charCodeAt(i) + ((hash << 5) - hash);
    }

    let colour = '#';

    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }

    return colour;
}
