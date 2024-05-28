import type { NovelItem } from '@app/_proto/Protos/novels';
import Link from '@app/components/link';
import Chips from '@app/domains/common/components/Chips';

type Props = {
    novel: NovelItem | null;
};

export default function NovelGenres({ novel }: Props) {
    return (
        <Chips>
            {novel?.language?.value && (
                <Link color="inherit" href={`/novels/?language=${novel?.language?.value}`} underline="none">
                    <Chips.Chip className="font-set-sb13" label={novel?.language?.value} />
                </Link>
            )}
            {novel?.genres?.map(genre => (
                <Link key={genre} color="inherit" href={`/novels/?genre=${genre}`} underline="none">
                    <Chips.Chip className="font-set-sb13" label={genre} />
                </Link>
            ))}
        </Chips>
    );
}
