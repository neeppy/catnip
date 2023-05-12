export default function enum2opt(e: any) {
    return Object.entries(e).map(entry => ({
        label: entry[0] as string,
        value: entry[1] as string,
    }));
}
