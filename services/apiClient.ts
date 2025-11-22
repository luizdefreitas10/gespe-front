import axios from "axios";
import { GetServerSidePropsContext, PreviewData } from "next";
import { parseCookies } from "nookies";
import { ParsedUrlQuery } from "querystring";

export function apiClient(
  ctx?: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
) {
  const BASE_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

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
  const BASE_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
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
