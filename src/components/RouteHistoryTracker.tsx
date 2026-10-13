import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ignored = new Set(["/entrar", "/cadastrar", "/pos-login"]);
export const previousRouteKey = "oportuniza:previous-safe-route";
const currentRouteKey = "oportuniza:current-safe-route";

export function RouteHistoryTracker() {
  const location = useLocation();
  useEffect(() => {
    if (ignored.has(location.pathname)) return;
    const next = `${location.pathname}${location.search}${location.hash}`;
    const current = sessionStorage.getItem(currentRouteKey);
    if (current && current !== next)
      sessionStorage.setItem(previousRouteKey, current);
    sessionStorage.setItem(currentRouteKey, next);
  }, [location]);
  return null;
}
