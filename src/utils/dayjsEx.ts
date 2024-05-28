import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(isBetween);

const dayjsEx = dayjs;

export default dayjsEx;
