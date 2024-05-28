import { type NovelItem, NovelItem_Status, SearchNovelsRequest } from '@app/_proto/Protos/novels';
import { NovelsClient } from '@app/_proto/Protos/novels.client';
import { logAnalyticsEvent } from '@app/analytics';
import { ReactComponent as SearchIcon } from '@app/assets/search.svg';
import { StyledAutoComplete, StyledSearchCircularProgress } from '@app/components/header/styles';
import { HeaderEvents } from '@app/domains/header/analytics/amplitude/events';
import { headerAnalyticsFactory } from '@app/domains/header/analytics/amplitude/handlers';
import { useHttp } from '@app/libs/http';
import { batch } from '@app/libs/utils';
import { Autocomplete, type AutocompleteRenderInputParams, CircularProgress, TextField } from '@mui/material';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

export default function HeaderSearchFetcher() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNovel] = useState<NovelItem | null>(null);
    const [searchResults, setSearchResults] = useState<NovelItem[]>([]);

    const [loading, setLoading] = useState(false);

    const navigating = useRef(false);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const { grpcRequest } = useHttp();

    const searchNovelsAsync = useCallback(
        async (searchQuery: string) => {
            if (!searchQuery || searchQuery.length === 0) {
                return [];
            }

            setLoading(true);

            try {
                const request = SearchNovelsRequest.create({
                    status: NovelItem_Status.All,
                    title: {
                        value: searchQuery,
                    },
                    count: 5,
                });

                const response = await grpcRequest(NovelsClient, c => c.searchNovels, request);

                setSearchResults(response.items || []);
                logAnalyticsEvent('Search', { On: 'GNB', Keyword: searchQuery });
            } catch (e) {
                return [];
            } finally {
                setLoading(false);
            }
        },
        [grpcRequest]
    );

    const debouncedSearch = useDebouncedCallback(searchNovelsAsync, 250);

    //#endregion : Server request to fetch search results

    //#region : Autocomplete callbacks
    const navigate = useNavigate();
    const { pathname } = useLocation();

    /** Custom. */
    const goToNovel = useCallback(
        async (e, novel: NovelItem) => {
            if (!novel?.slug) {
                return;
            }

            inputRef.current?.blur();

            navigating.current = true;

            setTimeout(() => {
                batch(() => {
                    setSearchQuery('');
                    setSearchResults([]);
                });
            });

            navigate(`/novel/${novel.slug}`);
            headerAnalyticsFactory(HeaderEvents.ClickSearchResult)({ on: 'GNB', novel: novel });
        },
        [navigate]
    );

    /** Custom. */
    const handleGetOptionLabel = useCallback((option: NovelItem) => {
        return option?.name || '';
    }, []);

    /** Custom. */
    const onChangeSearchQuery = useCallback((e, value: string) => {
        if (!navigating.current) {
            if (value) {
                setSearchQuery(value);
            } else {
                setSearchQuery('');
            }
        }
    }, []);

    /** Custom. */
    const handleFilterOpen = useCallback(option => {
        return option;
    }, []);

    useEffect(() => {
        if (searchQuery && searchQuery.length > 0 && !navigating.current) {
            debouncedSearch(searchQuery);
        }
    }, [debouncedSearch, searchQuery]);

    useEffect(() => {
        navigating.current = false;
    }, [pathname, searchResults]);

    /** Custom. */
    const renderInput = (params: AutocompleteRenderInputParams) => {
        return (
            <TextField
                {...params}
                InputProps={{
                    ...params.InputProps,
                    inputRef,
                    placeholder: 'Search',
                    startAdornment: <SearchIcon className="h-17 w-17 text-gray-placehold" />,
                    endAdornment: (
                        <>
                            {searchQuery.length > 0 && loading ? (
                                <CircularProgress
                                    css={StyledSearchCircularProgress}
                                    color="inherit"
                                    size={20}
                                    disableShrink
                                />
                            ) : (
                                <div css={StyledSearchCircularProgress}></div>
                            )}
                            {searchQuery.length > 0 && params.InputProps.endAdornment}
                        </>
                    ),
                    inputProps: {
                        ...params.inputProps,
                        className: '!placeholder:text-gray-placehold !font-set-m15',
                        'aria-label': 'search',
                    },
                }}
            />
        );
    };

    //#endregion : Autocomplete callbacks

    //#endregion : Variables, functions and api calls

    return (
        <Autocomplete
            css={StyledAutoComplete}
            classes={{
                inputRoot: 'h-44 !rounded-full !bg-gray-container-base',
            }}
            freeSolo
            options={searchResults}
            getOptionLabel={handleGetOptionLabel}
            onInputChange={onChangeSearchQuery}
            filterOptions={handleFilterOpen}
            onChange={goToNovel}
            value={selectedNovel}
            inputValue={searchQuery}
            autoHighlight
            renderInput={renderInput}
        />
    );
}
//#endregion : Main component
