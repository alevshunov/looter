import * as moment from 'moment';
import { Moment } from 'moment';

export default function(date: Date | Moment, format: string = 'DD MMMM YYYY, HH:mm') {
    if (!date) {
        return '-';
    }

    return moment(date)
        .locale('ru')
        .format(format);
}