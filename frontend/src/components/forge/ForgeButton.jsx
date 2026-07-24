import React from 'react';
import { Link } from 'react-router-dom';

/** Forge button — renders as router Link or anchor. */
export default function ForgeButton({ to, href, children, variant = 'primary', ...rest }) {
  const cls = `forge-btn ${variant === 'primary' ? 'forge-btn-primary' : 'forge-btn-ghost'}`;
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  return <a href={href || '#'} className={cls} {...rest}>{children}</a>;
}
