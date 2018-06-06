import * as moment from 'moment';

export default function(date: Date, format: string = 'DD MMMM YYYY, HH:mm') {
    if (!date) {
        return '-';
    }

    return moment(date)
        .locale('ru')
        .format(format);
}