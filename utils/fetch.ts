export async function myFetch(
  input: URL | RequestInfo,
  init?: RequestInit | undefined
): Promise<Response> {
  const result = await fetch(input, init);

  const error = {
    responseStatus: result.status,
    responseStatusText: result.statusText,
  };

  if (!result.ok) throw new Error(JSON.stringify(error));

  return result;
}
