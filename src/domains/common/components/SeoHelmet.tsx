import type { PropsWithChildren } from 'react';
import { Helmet, type HelmetProps } from 'react-helmet-async';

export type SeoHelmetProps = {
    title?: string;
    description?: string;
    keywords?: string;
    locale?: string;
    siteName?: string;
    siteUrl?: string;
    siteImage?: string;
    schemas?: Record<string, any>[];
} & HelmetProps;

export default function SeoHelmet({
    title = 'Wuxiaworld',
    description = 'Chinese fantasy novels and light novels!',
    keywords = undefined,
    locale = 'en_US',
    siteName = 'Wuxiaworld',
    siteUrl,
    siteImage = `${process.env.VITE_REACT_APP_SITE}/images/site-sns-image.png`,
    schemas,
    children,
    ...helmetProps
}: PropsWithChildren<SeoHelmetProps>) {
    const dynamicSiteUrl = `${process.env.VITE_REACT_APP_SITE}${siteUrl ?? ''}`;

    return (
        <Helmet {...helmetProps} defer={false}>
            <title>{title}</title>
            <link rel="canonical" href={dynamicSiteUrl} />
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content={locale} />
            <meta property="og:image" content={siteImage} />
            <meta property="og:url" content={dynamicSiteUrl} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={siteImage} />
            <meta name="twitter:url" content={dynamicSiteUrl} />
            {schemas?.map(schema => (
                <script key={schema['@type']} type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            ))}
            {children}
        </Helmet>
    );
}
