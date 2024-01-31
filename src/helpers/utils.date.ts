import * as moment from 'moment';

export const formatDateToBD = (date: string) => {
    return moment(date, 'YYYY-MM-DD').format('YYYYMMDD');
}

export const formatDateToJson = (date: number) => {
    return moment(date, 'YYYYMMDD').format('YYYY-MM-DD');
}

export function isValidDate(dateString: string | undefined): boolean {
    if (!dateString) {
        return false;
    }

    const date = moment(dateString, 'YYYYMMDD', true);
    return date.isValid();
}