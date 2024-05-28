import { CONTENT_SECTION_TITLE_STYLE } from '@app/domains/common/styles';
import { useHtmlToReact } from '@app/utils/html';

type Props = {
    descriptionHtml: string;
};

export default function NovelAboutDetail({ descriptionHtml }: Props) {
    const description = useHtmlToReact(descriptionHtml);

    return (
        <>
            <h4 className={CONTENT_SECTION_TITLE_STYLE}>Details</h4>
            <div className="fr-view prose font-set-r15-h150 max-w-none text-grey-800 dark:prose-invert sm2:font-set-r16-h150 dark:text-grey-300">
                {description}
            </div>
        </>
    );
}
