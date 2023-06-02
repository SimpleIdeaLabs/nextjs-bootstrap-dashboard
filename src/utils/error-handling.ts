import axios, { AxiosError, HttpStatusCode } from 'axios';
import { toast } from 'react-toastify';

interface HandleHttpRequestErrorParams {
  error: unknown;
  nonAxiosErrorCallback?: () => void;
  badRequestCallback?: (validationErrors?: any, message?: any) => void;
  unauthorizedRequestCallback?: () => void;
}

export function handleHttpRequestError(params: HandleHttpRequestErrorParams) {
  const { error, nonAxiosErrorCallback, badRequestCallback, unauthorizedRequestCallback } = params;
  console.log(error);
  /**
   * Axios Error
   */
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (error.code === 'ERR_NETWORK') {
      toast.error('It seems you are disconnected.');
      return;
    }

    if (axiosError.response) {
      const { response: errorResponse } = axiosError;
      const { status } = errorResponse;

      switch (status) {
        case HttpStatusCode.BadRequest:
          const errResponseData = (errorResponse as any).data;
          badRequestCallback && badRequestCallback(errResponseData.validationErrors, errResponseData.message);
          break;
        case HttpStatusCode.Unauthorized:
          unauthorizedRequestCallback && unauthorizedRequestCallback();
          break;
        default:
          toast.error('Oops! Something went wrong.');
          return;
      }
    }
  } else {
    nonAxiosErrorCallback && nonAxiosErrorCallback();
  }
}
