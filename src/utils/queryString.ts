/**
 * Build URLSearchParams from an object, omitting undefined/null values
 */
export function buildQueryString(
  params: Record<string, string | number | string[] | number[] | undefined | null>
): string {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(item => {
        urlParams.append(key, item.toString());
      });
    } else {
      urlParams.set(key, value.toString());
    }
  });

  return urlParams.toString();
}
