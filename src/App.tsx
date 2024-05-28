// eslint-disable-next-line simple-import-sort/imports
import AuthComponent from '@app/components/auth.component';
import { AppContext } from '@app/components/context';
import { ThemeProvider } from '@app/components/hooks';
import ModalProvider from '@app/components/modal/modal';
import { PAGE_LOGNAME_MAP, PORTAL_TOAST_ID } from '@app/constants';
import { ApiProvider } from '@app/libs/api';
import NovelPageComponent from '@app/novel';
import PageComponent from '@app/page';
import {
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
} from '@app/routes';
import { type PropsWithChildren, Suspense } from 'react';
import { Navigate, Outlet, Route, ScrollRestoration, createRoutesFromElements } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import { RecoilRoot } from 'recoil';
//#region : Persist query and cache settings

import { getOidcConfig } from '@app/libs/auth';
import '@app/styles/index.css';
import '@app/styles/tailwind.css';
import '@app/styles/vendor.css';

/**
 * Custom.
 * The Persistor interface for storing and restoring the cache to/from a persisted location.
 * We are storing cache in browser sessionStorage, sessionStorage object stores data for
 * only one session (the data is deleted when the browser tab is closed)
 */
// const persistor = createWebStoragePersistor({
//     storage: window.sessionStorage,
//     key: 'WUXIAWORLD_OFFLINE_QUERY_CACHE',
// });

//Persist the query client and the persistor created above.
// persistQueryClient({
//     queryClient,
//     persistor,
// });

//#endregion : Persist query and cache settings

//#region : Pages declaration

//#endregion : Pages declaration

export const AppRoutes = createRoutesFromElements(
    <Route path="/" element={<App />}>
        <Route
            path=""
            element={<PageComponent Component={Home} defaultMargins={false} logEventName={PAGE_LOGNAME_MAP.HOME} />}
        />
        <Route path="/news">
            <Route path="" element={<PageComponent Component={News} />} />
            <Route path=":slug" element={<PageComponent Component={NewsItem} />} />
        </Route>
        <Route path="account-locked" element={<PageComponent Component={AccountLocked} />} />
        <Route path="chat" element={<PageComponent Component={Chat} />} />
        <Route path="/updates" element={<PageComponent Component={Updates} />} />
        <Route path="/audiobooks" element={<Navigate replace to="/" />} />
        <Route
            path="/ebooks"
            element={<PageComponent Component={Ebooks} defaultMargins={false} logEventName={PAGE_LOGNAME_MAP.EBOOK} />}
        />
        <Route path="/announcements">
            <Route path="" element={<PageComponent Component={Announcements} />} />
            <Route path=":novelSlug">
                <Route path="" element={<PageComponent Component={AnnouncementsNovel} />} />
                <Route path=":slug" element={<PageComponent Component={Announcement} />} />
            </Route>
        </Route>
        <Route path="/page/:slug1">
            <Route path="" element={<PageComponent Component={CustomPage} />} />
            <Route path=":slug2" element={<PageComponent Component={CustomPage} />} />
        </Route>
        <Route path="/novels" element={<PageComponent Component={Novels} logEventName={PAGE_LOGNAME_MAP.NOVELS} />} />
        <Route path="/novel/:novelSlug">
            <Route path="" element={<NovelPageComponent logEventName={PAGE_LOGNAME_MAP.NOVEL} Component={Novel} />} />
            <Route
                path=":chapterSlug"
                element={
                    <NovelPageComponent Component={Chapter} headerStickyBoundary=".content-boundary" showNewsBanner />
                }
            />
        </Route>
        <Route path="/profile">
            <Route path="bookmarks" element={<Navigate to="/manage/bookmarks" replace />} />
        </Route>
        <Route path="/manage">
            <Route
                path="bookmarks"
                element={
                    <PageComponent
                        Component={ManageBookmarks}
                        defaultMargins={false}
                        logEventName={PAGE_LOGNAME_MAP.BOOKMARKS}
                    />
                }
            />
            <Route path="subscriptions/*" element={<PageComponent Component={ManageSubscriptions} />} />
            <Route path="profile/*" element={<PageComponent Component={ManageProfile} />} />
            <Route path="products">
                <Route
                    path="audiobooks"
                    element={<PageComponent Component={ManageAudiobooks} defaultMargins={false} />}
                />
                <Route path="ebooks" element={<PageComponent Component={ManageEbooks} defaultMargins={false} />} />
            </Route>
        </Route>
        <Route path="/auth">
            <Route path="logout" element={<PageComponent Component={AuthLogout} />} />
            <Route
                path="callback/wuxiaworld"
                element={<PageComponent Component={AuthWuxiaworldCallback} showNavItems={false} />}
            />
        </Route>
        <Route path="/contact-us" element={<PageComponent Component={ContactUs} />} />
        <Route path="/general-faq" element={<PageComponent Component={GeneralFaq} />} />
        <Route path="/about" element={<PageComponent Component={About} />} />
        <Route path="/terms-of-service" element={<PageComponent Component={TermsOfService} />} />
        <Route path="/privacy-policy" element={<PageComponent Component={PrivacyPolicy} />} />
        <Route path="/cookie-policy" element={<PageComponent Component={CookiePolicy} />} />
        <Route path="/privacy-policy-addendum-for-ccpa" element={<PageComponent Component={PrivacyPolicyCcpa} />} />
        <Route path="/privacy-policy-addendum-for-gdpr" element={<PageComponent Component={PrivacyPolicyGdpr} />} />
        <Route
            path="/maintenance"
            element={<PageComponent Component={Maintenance} showFooter={false} showNavItems={false} />}
        />
        <Route path="*" element={<PageComponent Component={Error404} />} />
    </Route>
);

/**
 * Custom.
 *
 * React root component.
 */
export default function App() {
    return (
        <RecoilRoot>
            <ThemeProvider>
                <TailwindThemeProvider>
                    <ModalProvider>
                        {/* <ReactQueryDevtools initialIsOpen={false} position="bottom-right" /> */}
                        <div id={PORTAL_TOAST_ID} />
                        <ToastContainer
                            position="bottom-center"
                            autoClose={3000}
                            icon={false}
                            transition={Slide}
                            theme={'dark'}
                            bodyClassName={'text-center'}
                            newestOnTop
                            hideProgressBar={true}
                            closeButton={false}
                            closeOnClick
                            draggable
                        />
                        {/* <ScrollToTop /> */}
                        <Suspense>
                            <ApiProvider>
                                <AuthComponent>
                                    <ScrollRestoration />
                                    <Outlet />
                                </AuthComponent>
                            </ApiProvider>
                        </Suspense>
                    </ModalProvider>
                </TailwindThemeProvider>
            </ThemeProvider>
        </RecoilRoot>
    );
}

export { AppContext, getOidcConfig };

/**
 * Custom.
 *
 * Helper function that scrolls the window to top.
 */
// function ScrollToTop() {
//     const navContext = useContext(NavigationContext);

//     const { pathname } = useLocation();

//     useEffect(() => {
//         let remove: (() => void) | null = null;

//         if (isBrowser()) {
//             const history = navContext.navigator as History;

//             const trackPageNavigation: Listener = ({ action }: Update) => {
//                 switch (action) {
//                     case 'PUSH':
//                     case 'REPLACE':
//                         window.scrollTo(0, 0);
//                         break;
//                 }
//             };

//             remove = history.listen(trackPageNavigation);
//         }

//         return () => {
//             remove?.();
//         };
//     }, [navContext.navigator, pathname]);

//     return null;
// }

// temporal component for handling ssr style issue (server always render dark mode)
const TailwindThemeProvider = ({ children }: PropsWithChildren<{}>) => (
    <div className="text-[#444444] dark:text-[#B6B6B6]">{children}</div>
);
