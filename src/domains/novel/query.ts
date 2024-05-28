export const novelQueryKeyFactory = {
    novel: ({ novelSlug, userId }: { novelSlug: string; userId?: string }) => {
        return ['novel', novelSlug, userId];
    },
};
