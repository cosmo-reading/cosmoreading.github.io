import possibleStandardNames from '@app/utils/possibleStandardNames';
import type * as CSS from 'csstype';
import { type AnyNode, type ChildNode, Element as DomElement, Text } from 'domhandler';
import { append, removeElement, replaceElement, textContent } from 'domutils';
import { parseDocument } from 'htmlparser2';
import {
    type HTMLAttributes,
    type HTMLProps,
    type ReactNode,
    createElement,
    isValidElement,
    useMemo,
    useState,
} from 'react';
import { Link } from 'react-router-dom';

type StyleKey = keyof CSS.PropertiesHyphen;
export type TagKey = keyof JSX.IntrinsicElements;

type TransformFunc<T> = (el: T) => AnyNode[];

type TransformObj<T> = {
    html?(el: T): AnyNode[];
    react?(el: T, node: ReactNode, uniqueKeyNumber?: number): ReactNode;
};

type HTMLElementType<T> = T extends HTMLElement
    ? T['tagName'] extends keyof JSX.IntrinsicElements
        ? JSX.IntrinsicElements[T['tagName']]
        : never
    : never;

type HTMLTag<T> = T extends HTMLAttributes<infer E> ? DomElement & { attribs: E } : never;
type HTMLProperties<E> = E extends Element ? HTMLProps<E> : never;

type Transform = {
    [Tag in keyof JSX.IntrinsicElements]?:
        | TransformFunc<HTMLTag<JSX.IntrinsicElements[Tag]>>
        | TransformObj<HTMLTag<JSX.IntrinsicElements[Tag]>>;
};

export type TagStyleExceptions = {
    customClasses?: string[];

    /**
     * If the tag has both backgroundColor & color style set & backgroundColor is not transparent,
     * than do not remove both backgroundColor and color style properties.
     */
    backgroundAndColorException?: boolean;
    doNotRemove?: StyleKey[];
};

/** Tag name should be of lowercase only. Otherwise it won't work */
export type TagsStyleExceptions = { [Tag in TagKey]?: TagStyleExceptions };

export type HtmlToReactOptions = {
    removeStyles?: StyleKey[];
    removeStylesExceptions?: StyleKey[];
    removeTags?: TagKey[];
    transform?: Transform;
    tagsStyleExceptions?: TagsStyleExceptions;
    replaceFontAwesome?: boolean;
};

const VOID_ELEMENTS = new Set(['img', 'hr', 'br', 'meta', 'col']);

export const DefaultHtmlStylesToRemove: StyleKey[] = [
    'color',
    'box-sizing',
    'orphans',
    'white-space',
    'letter-spacing',
    'text-indent',
    'text-decoration',
    'text-decoration-color',
    'text-decoration-style',
    'word-spacing',
    '-webkit-text-stroke-width',
    'text-transform',
    'font-family',
    'font-variant',
    'font-variant-ligatures',
    'font-variant-caps',
    'text-align',
    'background-color',
    'vertical-align',
    'line-height',
    'widows',
];

export const Paragraph: Transform['p'] = {
    react(_, node) {
        if (!isValidElement(node)) {
            return node;
        }

        return [
            createElement('span', { key: 'paragraph-content', ...node.props }),
            createElement('br', { key: 'br1' }),
            createElement('br', { key: 'br2' }),
        ];
    },
};

export const paragraphTransform: Transform['p'] = {
    react(_, node) {
        if (!isValidElement(node)) {
            return node;
        }

        return [
            <span key="paragraph-content">
                {node.props.children}
                <br />
            </span>,
        ];
    },
};

// const getAttributes = (el: Element): Record<string, any> => {
//     const attribs = {};

//     for (const name of el.getAttributeNames()) {
//         const attrib = el.getAttribute(name);

//         if (attrib) {
//             attribs[name] = attrib;
//         }
//     }

//     return attribs;
// };

const isBaseUrl = (href: string, url: URL) => {
    const currentHostname = typeof window !== 'undefined' ? location.hostname : process.env.VITE_REACT_APP_BASE_URL;

    return href.startsWith('/') || url.hostname === currentHostname;
};

const DefaultTransforms: Transform = {
    a: {
        react(el, node) {
            if (!isValidElement(node)) {
                return node;
            }

            const href = el.attribs.href;

            if (!href) {
                return node;
            }

            let url: URL | undefined;

            try {
                url = new URL(href);
            } catch (e) {
                return node;
            }

            if (isBaseUrl(href, url)) {
                const props = node.props;

                return (
                    <Link
                        key={node.key}
                        to={{ pathname: url.pathname, hash: url.hash }}
                        reloadDocument={!!url.hash}
                        {...props}
                    />
                );
            }

            return node;
        },
    },
};

export const useHtmlToReact = (html: string, options?: HtmlToReactOptions): JSX.Element => {
    const [state] = useState(options || {});

    const { removeStyles, removeStylesExceptions, removeTags, transform, tagsStyleExceptions, replaceFontAwesome } =
        state;

    return useMemo(
        () =>
            htmlToReactElements(
                html,
                removeStyles,
                removeStylesExceptions,
                removeTags,
                transform,
                tagsStyleExceptions,
                replaceFontAwesome
            ),
        [html, removeStyles, removeStylesExceptions, removeTags, transform, tagsStyleExceptions, replaceFontAwesome]
    ) as JSX.Element;
};

export const htmlToReactElements = (
    html?: string | null,
    removeStyles?: StyleKey[],
    removeStylesExceptions?: StyleKey[],
    removeTags?: TagKey[],
    transform?: Transform,
    tagsStyleExceptions?: TagsStyleExceptions,
    replaceFontAwesome?: boolean
) => {
    if (!html || html.length === 0) {
        return null;
    }

    transform = {
        ...DefaultTransforms,
        ...(transform || {}),
    };

    // const parser = new DOMParser();
    // const doc = parser.parseFromString(html, 'text/html');

    const tagsToRemove = new Set(removeTags || []);
    const globalStylesToRemove = new Set([...DefaultHtmlStylesToRemove, ...(removeStyles || [])]);

    const handleNode = (node: DomElement) => {
        const tagName = node.tagName.toLowerCase() as TagKey;

        const tagStyleExceptions: TagStyleExceptions = tagsStyleExceptions?.[tagName] ?? {};
        tagStyleExceptions.doNotRemove = tagStyleExceptions.doNotRemove || [];

        if (tagsToRemove.has(tagName)) {
            removeElement(node);

            return;
        }

        if (node instanceof DomElement) {
            if (node.name === 'script') {
                return;
            }

            let classes = node.attribs['class']?.split(' ') || [];

            if (tagStyleExceptions.customClasses && tagStyleExceptions.customClasses.length > 0) {
                classes.push(...tagStyleExceptions.customClasses);
            }

            if (node.attribs['style']) {
                const styles = node.attribs['style'].split(';').map(prop => {
                    const [key, value] = prop.split(':').map(p => p.trim());

                    return { key, value };
                });

                const styleDict = styles.reduce<Record<string, string>>((acc, { key, value }) => {
                    acc[key] = value;

                    return acc;
                }, {});

                const localExceptions: StyleKey[] = [];

                if (tagStyleExceptions.backgroundAndColorException) {
                    const color = styleDict['color'];
                    const backgroundColor = styleDict['background-color'];

                    if (backgroundColor !== '' && backgroundColor !== 'transparent' && color !== '') {
                        localExceptions.push('color');
                        localExceptions.push('background-color');
                    }
                }

                for (const styleKey of globalStylesToRemove.values()) {
                    if (
                        !tagStyleExceptions.doNotRemove.includes(styleKey) &&
                        !localExceptions.includes(styleKey) &&
                        !removeStylesExceptions?.includes(styleKey)
                    ) {
                        const styleIdx = styles.findIndex(f => f.key === styleKey);

                        if (styleIdx > -1) {
                            styles.splice(styleIdx, 1);
                        }
                    }
                }

                node.attribs['style'] = styles.map(({ key, value }) => `${key}: ${value};`).join(' ');
            }

            if (replaceFontAwesome && tagName == 'i') {
                const removeClasses = ['fa-hand-point-left', 'fa-hand-point-left'];

                if (classes.includes('fa-hand-o-left') || classes.includes('fa-hand-point-left')) {
                    classes = classes.filter(f => !removeClasses.includes(f));

                    const span = new DomElement('span', {}, [new Text('☜')]);
                    replaceElement(node, span);
                }
            }

            if (classes.length > 0) {
                node.attribs['class'] = classes.join(' ');
            } else {
                delete node.attribs['class'];
            }
        }

        const transformTag = transform?.[tagName];

        if (transformTag && node instanceof DomElement) {
            const newNodes =
                'html' in transformTag && transformTag.html !== undefined
                    ? transformTag.html(node as HTMLElementType<typeof node>)
                    : typeof transformTag === 'function'
                      ? transformTag(node as HTMLElementType<typeof node>)
                      : undefined;

            if (newNodes !== undefined) {
                for (const newNode of newNodes) {
                    append(node, newNode);
                }

                removeElement(node);
            }
        }
    };

    const handleElements = (childNodes: ChildNode[]) => {
        const reactNodes: ReactNode[] = [];
        let ctr = 1;

        for (const node of childNodes) {
            if (node instanceof DomElement) {
                const attribs = node.attribs;
                const tagName = node.tagName.toLowerCase() as TagKey;

                const props: HTMLProperties<Element> = {};

                for (const attrib of Object.keys(attribs)) {
                    if (possibleStandardNames[attrib]) {
                        props[possibleStandardNames[attrib]] = attribs[attrib];
                    } else if (attrib.startsWith('data-')) {
                        props[attrib] = attribs[attrib];
                    }
                }

                // props.style = styleToJs(attribs['style'], {
                //     reactCompat: true,
                // });
                props.style =
                    attribs['style']?.split(';').reduce((p, c) => {
                        let [key, value] = c.split(':').map(p => p.trim());
                        key = key.replace(/-([a-z])/gi, (s, group1) => group1.toUpperCase());

                        p[key] = value;

                        return p;
                    }, {}) || {};

                props.key = ctr;

                if (!VOID_ELEMENTS.has(tagName)) {
                    props.children = handleElements(Array.from(node.childNodes));
                }

                const transformTag = transform?.[tagName];

                let reactNode = createElement(tagName, props) as ReactNode;

                if (transformTag && 'react' in transformTag && transformTag.react !== undefined) {
                    reactNode = transformTag.react(node as HTMLElementType<typeof node>, reactNode, ctr);
                }

                reactNodes.push(reactNode);
            } else {
                reactNodes.push(<span key={ctr}>{textContent(node)}</span>);
            }

            ctr++;
        }

        return reactNodes;
    };

    const doc = parseDocument(html);
    const nodes = Array.from(doc.childNodes);

    let currentNode: ChildNode | null | undefined = null;

    while (nodes.length > 0) {
        currentNode = nodes.shift();

        if (currentNode instanceof DomElement) {
            handleNode(currentNode);

            nodes.push(...currentNode.childNodes);
        }
    }

    const reactNodes = handleElements(Array.from(doc.childNodes));

    return <>{reactNodes}</>;
};
