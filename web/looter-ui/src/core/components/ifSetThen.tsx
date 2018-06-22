export default function(source: any, get: (source: any) => any, empty: any = null) {
    if (source) {
        return get(source);
    } else {
        return empty;
    }
}