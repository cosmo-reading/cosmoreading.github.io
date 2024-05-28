import clsx from 'clsx';

type Props = {
    flair?: string;
};

export default function UserFlairBadge({ flair }: Props) {
    if (!flair) return null;
    return (
        <span className={clsx('font-set-b10 ml-2 rounded-3 px-4 py-2 sm2:ml-4', colorClassMap[flair])}>{flair}</span>
    );
}
const colorClassMap = {
    Admin: 'bg-blue-50 text-blue-700 dark:bg-blue-800 dark:text-blue-50',
    Staff: 'bg-purple-50 text-purple-800 dark:bg-purple-800 dark:text-purple-50',
    Translator: 'bg-green-30 text-green-700 dark:bg-green-800 dark:text-green-50',
    get Author() {
        return this.Translator;
    },
    Editor: 'bg-deeporange-50 text-deeporange-800 dark:bg-deeporange-900 dark:text-deeporange-50',
};
