import { useEffect } from 'react';

export default function Seo({ title, description, keywords, canonical }) {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) document.title = title;

    const metadata = [
      ['meta[name="description"]', { name: 'description', content: description }],
      ['meta[name="keywords"]', { name: 'keywords', content: keywords }],
      ['meta[property="og:title"]', { property: 'og:title', content: title }],
      ['meta[property="og:description"]', { property: 'og:description', content: description }],
      ['meta[property="og:url"]', { property: 'og:url', content: canonical }],
      ['meta[name="twitter:title"]', { name: 'twitter:title', content: title }],
      ['meta[name="twitter:description"]', { name: 'twitter:description', content: description }],
    ];

    const created = [];
    metadata.forEach(({ content, ...attributes }) => {
      if (!content) return;
      const element = document.createElement(attributes.name ? 'meta' : 'meta');
      Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
      element.setAttribute('content', content);
      document.head.appendChild(element);
      created.push(element);
    });

    if (canonical) {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = canonical;
      document.head.appendChild(link);
      created.push(link);
    }

    return () => {
      if (title) document.title = previousTitle;
      created.forEach((element) => element.remove());
    };
  }, [title, description, keywords, canonical]);

  return null;
}
