import type { NovelItem } from '@app/_proto/Protos/novels';
import Link from '@app/components/link';
import { StyledContentSection, StyledContentSectionTitle } from '@app/components/shared/text-pages.styles';
import { CONTENT_SECTION_TITLE_STYLE } from '@app/domains/common/styles';
import TabsTextPlaceholder from '@app/domains/novel/components/TabsTextPlaceholder';
import { BASE_SKELETON_PROPS } from '@app/domains/novel/constants';
import { Grid } from '@mui/material';

export default function NovelAnnouncementsWrapper({
    children,
    novel,
    loaded,
}: {
    children?: React.ReactNode;
    novel?: NovelItem;
    loaded: boolean;
}) {
    return (
        <StyledContentSection className="mx-auto mt-[12px] px-0" showDivider={false}>
            <Grid className="mb-[14px]" container direction="row" justifyContent="space-between" alignItems="center">
                <Grid item>
                    <StyledContentSectionTitle>
                        <TabsTextPlaceholder
                            item={loaded}
                            className="h-[20px] w-[164px]"
                            skeletonProps={BASE_SKELETON_PROPS}
                        >
                            <span className={CONTENT_SECTION_TITLE_STYLE}>Translator's Notice</span>
                        </TabsTextPlaceholder>
                    </StyledContentSectionTitle>
                </Grid>
                {loaded && (
                    <Grid item>
                        <Link
                            className="cursor-pointer text-[15px] font-bold text-blue hover:underline"
                            href={`/announcements/${novel?.slug}`}
                        >
                            View All
                        </Link>
                    </Grid>
                )}
            </Grid>
            {children}
        </StyledContentSection>
    );
}
