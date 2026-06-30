import axios, { AxiosResponse } from "axios";
import { SetStateAction } from "react";

type NextServerError = {
  error: string;
};
type requestBody = Record<string, any> | FormData;

const get = async (url: string, params?: Record<string, any>) => {
  const response = await axios.get("/api" + url, params);
  return response;
};

const post = async (
  url: string,
  body: requestBody = {},
  params?: Record<string, any>,
) => {
  const response = await axios.post(url, body, params);
  return response;
};

const put = async (
  url: string,
  body: requestBody = {},
  params?: Record<string, any>,
) => {
  const response = await axios.put(url, body, params);
  return response;
};

const deleteReq = async (url: string) => {
  const response = await axios.delete(url);
  return response;
};

export const requestHandler = {
  get,
  post,
  put,
  delete: deleteReq,
};

export const getData = async <T>(
  url: string,
  params?: Record<string, any>,
  returnResponse: boolean = false,
): Promise<
  typeof returnResponse extends true ? AxiosResponse<any> : T | undefined
> => {
  try {
    const response = await requestHandler.get(url, params);
    if (returnResponse) return response as any;
    return response.data as any;
  } catch (error: unknown) {
    if (axios.isAxiosError<NextServerError>(error)) {
      console.error(error.response?.data?.error);
    }
    return undefined as any;
  }
};

export const createData = async <T>(
  url: string,
  body: requestBody,
  params?: Record<string, any>,
  returnAxiosResponse: boolean = false,
) => {
  try {
    const response = await requestHandler.post(url, body, params);
    if (returnAxiosResponse) {
      return response;
    }
    const data: T = response.data;
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError<NextServerError>(error)) {
      console.error(error.response.data.error);
    }
  }
};

export const updateData = async <T>(
  url: string,
  body: requestBody,
  params?: Record<string, any>,
  returnAxiosResponse: boolean = false,
) => {
  try {
    const response = await requestHandler.put(url, body, params);
    if (returnAxiosResponse) {
      return response;
    }
    const data: T = response.data;
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError<NextServerError>(error)) {
      console.error(error.response.data.error);
    }
  }
};

export const deleteData = async (
  url: string,
  returnAxiosResponse: boolean = false,
) => {
  try {
    const response = await requestHandler.delete(url);
    if (returnAxiosResponse) {
      return response;
    }
    const data = response.data;
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError<NextServerError>(error)) {
      console.error(error.response.data.error);
    }
  }
};
