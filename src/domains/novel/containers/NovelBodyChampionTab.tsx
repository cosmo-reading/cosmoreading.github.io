import type { NovelItem } from '@app/_proto/Protos/novels';
import { PaymentMethodGateway } from '@app/_proto/Protos/payments';
import type { SubscriptionItem } from '@app/_proto/Protos/subscriptions';
import Loading from '@app/components/loading';
import { CHAMPION_EVENT_SOURCES } from '@app/domains/champion/analytics/amplitude/constants';
import ChampionBenefitBox from '@app/domains/champion/components/ChampionBenefitBox';
import ChampionOtherGatewayBox, { WebGateways } from '@app/domains/champion/components/ChampionOtherGatewayBox';
import ChampionPlanWithDialog from '@app/domains/champion/containers/ChampionPlanWithDialog';
import ScreenBackground from '@app/domains/common/containers/ScreenBackground';
import { parseChampionSubscriptionStatus, parseNovelStatus } from '@app/domains/common/utils';
import { lazy } from 'react';

const SponsorPlansComponent = lazy(() => import('@app/components/sponsors'));

type Props = {
    novel: NovelItem;
    activeSubscription?: SubscriptionItem | undefined;
};

export default function NovelBodyChampionTab({ novel, activeSubscription }: Props) {
    return (
        <div
            data-amplitude-params={JSON.stringify({
                on: CHAMPION_EVENT_SOURCES.NovelCover,
            })}
        >
            <ScreenBackground className="bg-gray-100 dark:bg-gray-850">
                {activeSubscription ? (
                    <SubscribedLayout novel={novel} activeSubscription={activeSubscription} />
                ) : (
                    <NotSubscribedLayout novel={novel} />
                )}
            </ScreenBackground>
        </div>
    );
}

const NotSubscribedLayout = ({ novel }: Pick<Props, 'novel'>) => {
    const { advanceChapterCount } = parseNovelStatus(novel);
    return (
        <>
            <ScreenBackground className="dark:bg-gradient-to-b dark:from-gray-900 dark:to-transparent">
                <div className="text-center">
                    <div className="flex flex-col items-center px-8">
                        <div className="pb-12 pt-24">
                            <img
                                className="h-32 w-140 object-contain md:h-36 md:w-167"
                                src="/images/champion-logo@3x.png"
                                alt="champion logo"
                            />
                        </div>
                        <h1 className="font-set-b28 whitespace-pre-line pb-12 text-gray-t1 md:font-set-b32">{`Be a Champion of\n${
                            novel.name || ''
                        }`}</h1>
                        <h4 className="font-set-m15 pb-28 text-gray-t3 md:font-set-m16">
                            Directly support authors and translators, and be rewarded for it!
                        </h4>
                        <h3 className="font-set-b20 w-full bg-gradient-ww-blue-button bg-clip-text pb-16 text-transparent md:font-set-b21">
                            No more waiting!
                        </h3>
                    </div>
                    <div className="pb-40">
                        <ChampionBenefitBox advanceChapterCount={advanceChapterCount} />
                    </div>
                </div>
            </ScreenBackground>
            <div className="text-center">
                <h2 className="font-set-sb20 pb-16 text-gray-t1 md:font-set-sb21">Choose Champion Tiers</h2>
            </div>
            <Loading>
                <div className="pb-40">
                    <SponsorPlansComponent novel={novel} />
                </div>
            </Loading>
        </>
    );
};

type SubscribedLayoutProps = Props;
const SubscribedLayout = ({ novel, activeSubscription }: SubscribedLayoutProps) => {
    const { plan: activePlan } = parseChampionSubscriptionStatus(activeSubscription);
    const activeExcludingFilter = plan => {
        if (!activePlan?.id) return true;
        const notActive = plan.id !== activePlan.id;
        return notActive;
    };

    const isSubscriptionWeb = WebGateways.includes(activeSubscription?.paymentGateway ?? PaymentMethodGateway.None);

    return (
        <>
            <ScreenBackground className="bg-gradient-to-b from-blue-100 to-transparent dark:from-blue-990">
                <div className="flex flex-col items-center px-8 text-center">
                    <img
                        className="pt-24"
                        src="/images/champion-logo@3x.png"
                        alt="champion logo"
                        width={140}
                        height={32}
                    />
                    <h1 className="font-set-b26 pb-4 text-gray-t1 md:font-set-b28">{novel.name || ''}</h1>
                    <h4 className="font-set-m15 text-gray-desc">You are already subscribed.</h4>
                </div>
                {isSubscriptionWeb && activePlan ? (
                    <div className="flex justify-center border-b border-gray-330 py-20 dark:border-gray-800">
                        <ChampionPlanWithDialog plan={activePlan} currentSubscription={activeSubscription ?? null} />
                    </div>
                ) : !isSubscriptionWeb ? (
                    <ChampionOtherGatewayBox gateway={activeSubscription?.paymentGateway} />
                ) : null}
            </ScreenBackground>
            {isSubscriptionWeb && (
                <>
                    <div className="text-center">
                        <h2 className="font-set-sb20 py-16 text-gray-t1 md:font-set-sb21">Change Your Champion Tier</h2>
                    </div>

                    <Loading>
                        <div className="pb-42">
                            <SponsorPlansComponent novel={novel} plansFilter={activeExcludingFilter} />
                        </div>
                    </Loading>
                </>
            )}
        </>
    );
};
