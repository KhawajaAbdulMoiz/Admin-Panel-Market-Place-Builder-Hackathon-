export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-01-01';

  export const dataset = assertValue(
    process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
  );
  
  export const projectId = assertValue(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "tm81kbvj",
    'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
  );
  
  export const token = assertValue(
    process.env.SANITY_API_TOKEN || "sk1zYLo37gbqSHKhRZeCT7thj0cn8diBgHSTuXmDG6Oc6NQmiMRQowIg7yhTV2LqEewQ1Afc4v0lCV4h48RVXSvdkiNA58Lf4cHC3AQppAmrPGACeiIXyhUseAFi92IZVsSXeaCWM4zBL2qFGFmMSYfGvBGh7aJV2s8KQAGI7maqJPd4Tzul",
    'Missing environment variable: SANITY_API_TOKEN'
  );
  

export function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (!v) {
    throw new Error(errorMessage);
  }
  return v;
}
