import axios from "axios";
import { GetServerSidePropsContext, PreviewData } from "next";
import { parseCookies } from "nookies";
import { ParsedUrlQuery } from "querystring";

function resolveBaseDomain() {
  const envDomain = process.env.NEXT_PUBLIC_DOMAIN?.trim();
  const isProduction = process.env.NODE_ENV === "production";
  const isLocalDomain =
    !!envDomain &&
    (envDomain.includes("localhost") || envDomain.includes("127.0.0.1"));

  if (isProduction && (!envDomain || isLocalDomain)) {
    return "https://gespe-api.onrender.com";
  }

  return envDomain || "http://localhost:3333";
}

export function apiClient(
  ctx?: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
) {
  const BASE_DOMAIN = resolveBaseDomain();

  const { "gespe:x-token": sessionKey } = parseCookies(ctx);

  const api = axios.create({
    baseURL: BASE_DOMAIN,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });

  if (sessionKey) {
    api.defaults.headers.common.Authorization = `Bearer ${sessionKey}`;
  }
  return api;
}

export function apiServer(ctx: GetServerSidePropsContext) {
  const BASE_DOMAIN = resolveBaseDomain();
  const { "gespe:x-token": sessionKey } = parseCookies(ctx);

  const api = axios.create({
    baseURL: BASE_DOMAIN,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });

  if (sessionKey) {
    api.defaults.headers.common.Authorization = `Bearer ${sessionKey}`;
  }
  return api;
}
