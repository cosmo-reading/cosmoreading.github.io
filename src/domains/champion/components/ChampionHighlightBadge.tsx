export default function ChampionHighlightBadge() {
    return (
        <div className="flex flex-col items-center">
            <div className="font-set-sb12 rounded-4 bg-gradient-ww-champion-status py-4 px-6 text-white">
                Sponsor this story!
            </div>
            <div className="h-6 w-6 origin-top-right rotate-45 bg-gradient-ww-champion-status pl-8" />
        </div>
    );
}
