import { css } from '@emotion/react';

export const ContentCenter = css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
});

export const ContentAlignCenter = css({
    display: 'flex',
    alignItems: 'center',
});

export const HeroHighlightContainer = () =>
    css({
        display: 'flex',
        width: '100%',
        // maxWidth: '840px',
        flexDirection: 'column',
        position: 'relative',
    });

export const ContentSection = css({
    margin: '48px 0px !important',
    '& > *': {
        margin: '16px 0px !important',
    },
    '& a': {
        color: '#127afe',
    },
});

export const PolicySection = theme =>
    css({
        margin: '48px 0px !important',
        '& > *': {
            margin: '16px 0px !important',
        },
        '& a': {
            color: '#127afe',
        },
        '& ul': {
            paddingLeft: '20px',
            listStyle: 'disc',
        },
        '& ul ul': {
            fontWeight: 'normal',
            listStyle: 'circle',
        },
        '& ul > li': {
            marginLeft: '16px',
            marginTop: '5px',
        },
        '& ul > li > p': {
            fontWeight: 'bold',
        },
        '& table, th, td': {
            border: '1px solid',
            borderCollapse: 'collapse',
            borderColor: theme.palette.main,
            padding: '15px',
        },
        '& ol li p': {
            marginLeft: '16px',
            marginTop: '5px',
        },
        '& ol p p': {
            fontWeight: 'bold',
        },
        '& #ccpa_table tr td:nth-child(n+3)': {
            textAlign: 'center',
        },
        '& ul ul ul': {
            listStyle: 'square',
        },
    });
