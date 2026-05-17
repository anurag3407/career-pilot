export function isNavActive(path, pathname) {
  if (pathname === path) return true;
  if (path !== "/" && pathname.startsWith(`${path}/`)) return true;
  return false;
}
