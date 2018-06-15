export default function(value?: string | number, prefix: string = ' ', postfix: string = '', empty: string = '') {
    if (value) {
        return prefix + value + postfix;
    } else {
        return empty;
    }
}