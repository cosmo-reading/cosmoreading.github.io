import { lazy } from 'react';

const Home = lazy(() => import('./pages/home'));
const Updates = lazy(() => import('./pages/updates'));
const News = lazy(() => import('./pages/news'));
const Ebooks = lazy(() => import('./pages/ebooks'));
const NewsItem = lazy(() => import('./pages/news/[slug]'));
const Announcements = lazy(() => import('./pages/announcements'));
const AnnouncementsNovel = lazy(() => import('./pages/announcements/[novelSlug]'));
const Announcement = lazy(() => import('./pages/announcements/[novelSlug]/[slug]'));
const Novels = lazy(() => import('./pages/novels'));
const Novel = lazy(() => import('./pages/novel/[novelSlug]'));
const Chapter = lazy(() => import('./pages/novel/[novelSlug]/[chapterSlug]'));
const ManageBookmarks = lazy(() => import('./pages/manage/bookmarks'), {
    ssr: false,
});
const ManageSubscriptions = lazy(() => import('./pages/manage/subscriptions'), {
    ssr: false,
});
const ManageProfile = lazy(() => import('./pages/manage/profile'), {
    ssr: false,
});
const ManageAudiobooks = lazy(() => import('./pages/manage/products/audiobooks'), {
    ssr: false,
});
const ManageEbooks = lazy(() => import('./pages/manage/products/ebooks'), {
    ssr: false,
});
const AuthLogout = lazy(() => import('./pages/auth/logout'), {
    ssr: false,
});
const AuthWuxiaworldCallback = lazy(() => import('./pages/auth/callback/wuxiaworld'), {
    ssr: false,
});
const ContactUs = lazy(() => import('./pages/contact-us'));
const GeneralFaq = lazy(() => import('./pages/general-faq'));
const About = lazy(() => import('./pages/about'));
const TermsOfService = lazy(() => import('./pages/terms-of-service'));
const PrivacyPolicy = lazy(() => import('./pages/privacy-policy'));
const CookiePolicy = lazy(() => import('./pages/cookie-policy'));
const PrivacyPolicyCcpa = lazy(() => import('./pages/privacy-policy-addendum-for-ccpa'));
const PrivacyPolicyGdpr = lazy(() => import('./pages/privacy-policy-addendum-for-gdpr'));
const CustomPage = lazy(() => import('./pages/page/[slug]'));
const Error404 = lazy(() => import('./pages/404'));
const Maintenance = lazy(() => import('./pages/maintenance'));
const AccountLocked = lazy(() => import('./pages/account-locked'), {
    ssr: false,
});
const Chat = lazy(() => import('./pages/chat'), {
    ssr: false,
});

export {
    About,
    AccountLocked,
    Announcement,
    Announcements,
    AnnouncementsNovel,
    AuthLogout,
    AuthWuxiaworldCallback,
    Chapter,
    Chat,
    ContactUs,
    CookiePolicy,
    CustomPage,
    Ebooks,
    Error404,
    GeneralFaq,
    Home,
    Maintenance,
    ManageAudiobooks,
    ManageBookmarks,
    ManageEbooks,
    ManageProfile,
    ManageSubscriptions,
    News,
    NewsItem,
    Novel,
    Novels,
    PrivacyPolicy,
    PrivacyPolicyCcpa,
    PrivacyPolicyGdpr,
    TermsOfService,
    Updates,
};
