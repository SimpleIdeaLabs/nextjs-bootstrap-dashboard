export function removeQueryParams(url: string): string {
  try {
    const urlWithoutParams = url.replace(/\?.*/, '');
    return urlWithoutParams;
  } catch (error) {
    console.log(error);
    return url;
  }
}
