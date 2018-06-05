function adoptTermToLike(term: string) {
    term = term || '';
    term = term.trim();

    if (term.length === 0) {
        return '%';
    }

    return `%${term.replace(/\*/g, '%') || ''}%`;
}

function extractTermDetails(term: string) : {term: string, direction: string, minPrice: number, maxPrice: number} {
    term = term || '';

    let direction = '%';
    let minPrice = 0;
    let maxPrice = 1000000000;
    let realTerm = '';

    let terms = term.split('&').map(x => x.trim());

    for (let i=0; i<terms.length; i++) {
        let termPart = terms[i];

        if (/^[sSbB]\>.*/.test(termPart)) {
            direction = termPart[0].toLowerCase() === 's' ? 'sell' : 'buy';
            realTerm = termPart.substring(2).trim();
        } else
        if (/^[pP](\>|\<)([0-9]+).*/.test(termPart)) {
            let price = parseInt(termPart.substring(2).trim());
            if (termPart[1] === '>') {
                minPrice = price;
            } else {
                maxPrice = price;
            }
        } else {
            realTerm = termPart;
        }
    }

    realTerm = adoptTermToLike(realTerm);

    return { term: realTerm, direction: direction, maxPrice, minPrice };
}

export {
    adoptTermToLike,
    extractTermDetails
}