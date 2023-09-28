export async function myFetch(
  input: URL | RequestInfo,
  init?: RequestInit | undefined
): Promise<Response> {
  const result = await fetch(input, init);

  if (!result.ok)
    throw new Error(`status: ${result.status}, message: ${result.statusText}`);

  return result;
}
