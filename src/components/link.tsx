import { Link as MuiLink, type LinkProps as MuiLinkProps } from '@mui/material';
import clsx from 'clsx';
import * as React from 'react';
import { Link, type LinkProps, useMatch } from 'react-router-dom';

//#region : Main component

/**
 * Custom.
 *
 * Main component parameters type.
 * Extend LinkProps, MuiLinkProps and Record with custom properties.
 */
export type LinkComponentProps = Omit<LinkProps, 'href' | 'to'> &
    Omit<MuiLinkProps, 'variant'> & {
        href: string;
        activeClassName?: string;
    } & Record<string, any>;

/**
 * Custom helper component.
 *
 * Use this when you want to show the link component as active,
 * when it matches the current browser url.
 */
function LinkComponent(props: LinkComponentProps, ref: React.Ref<HTMLElement>) {
    const { href, activeClassName = 'active', className: classNameProps, children, component, ...other } = props;

    const match = useMatch({
        path: href.toString(),
        end: true,
    });

    const className = clsx(classNameProps, {
        [activeClassName]: match && activeClassName,
    });

    const Component = component || Link;

    return (
        <MuiLink ref={ref} className={className} underline="hover" {...other} to={href} component={Component}>
            {children}
        </MuiLink>
    );
}

/**
 * Custom helper component.
 *
 * Use this when you want to show the link component as active,
 * when it matches the current browser url.
 */
export default React.forwardRef(LinkComponent) as React.ComponentType<LinkComponentProps>;

//#endregion : Main component
