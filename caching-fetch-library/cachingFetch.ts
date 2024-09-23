import {useState, useEffect} from 'react';

//Create a cache here to keep all changes within this file.
//URL is Key === string.

//define Cache type
//Ideally, we add all sets and gets, but keep it simple due to time constraint
type Cache<T> = {
  [key: string]: T;
};

//Define types for cache entry's
type CacheData = {
  data: unknown;
  error: Error | null;
};

//Initialize global cache
const cache: Cache<CacheData> = {};


// You may edit this file, add new files to support this file,
// and/or add new dependencies to the project as you see fit.
// However, you must not change the surface API presented from this file,
// and you should not need to change any other files in the project to complete the challenge

type UseCachingFetch = (url: string) => {
  isLoading: boolean;
  data: unknown;
  error: Error | null;
};



/**
 * 1. Implement a caching fetch hook. The hook should return an object with the following properties:
 * - isLoading: a boolean that is true when the fetch is in progress and false otherwise
 * - data: the data returned from the fetch, or null if the fetch has not completed
 * - error: an error object if the fetch fails, or null if the fetch is successful
 *
 * This hook is called three times on the client:
 *  - 1 in App.tsx
 *  - 2 in Person.tsx
 *  - 3 in Name.tsx
 *
 * Acceptance Criteria:
 * 1. The application at /appWithoutSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should only see 1 network request in the browser's network tab when visiting the /appWithoutSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */


export const useCachingFetch: UseCachingFetch = (url) => {
  // State to track loading, data, and error
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
  //if URL is in cache, return data from cache
  if (cache[url]) {
    console.log(`cache hit for ${url}=== ${cache[url]}`);
    setIsLoading(false);
    setData(cache[url].data);
    setError(cache[url].error);
    return;
  }

  //else, fetch data.
  fetch(url)
    .then((response) => {
      //parse JSON
      return response.json();
    })
    .then((data) => {
      //cache data
      cache[url] = { data, error: null };
      console.log(`Data fetched and cached`);
      setIsLoading(false);
      setData(cache[url].data);
      setError(cache[url].error);
      return;
    })
    .catch((err) => {
      const error = err as Error;
      cache[url] = { data: null, error: error };
      console.error(`Error fetching data for -> ${url}:`, error);
      setIsLoading(false);
      setData(cache[url].data);
      setError(cache[url].error);
      return;
    });
  }, [url]);

  //return state
  return {
    isLoading,
    data,
    error,
  };
};

/**
 * 2. Implement a preloading caching fetch function. The function should fetch the data.
 *
 * This function will be called once on the server before any rendering occurs.
 *
 * Any subsequent call to useCachingFetch should result in the returned data being available immediately.
 * Meaning that the page should be completely serverside rendered on /appWithSSRData
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript disabled, you should see a list of people.
 * 2. You have not changed any code outside of this file to achieve this.
 * 3. This file passes a type-check.
 *
 */
export const preloadCachingFetch = async (url: string): Promise<void> => {
  //if data is already loaded in cache, return.
  if (cache[url]) {
    return;
  }
  //if not in cache, fetch data
  try {
    const response = await fetch(url);
    const data = await response.json();

    //cache data
    cache[url] = { data, error: null };
    console.log(`Data fetched and cached`);
  } catch (err) {
    //cache error
    const error = err as Error;
    cache[url] = { data: null, error: error };
  }
};

/**
 * 3.1 Implement a serializeCache function that serializes the cache to a string.
 * 3.2 Implement an initializeCache function that initializes the cache from a serialized cache string.
 *
 * Together, these two functions will help the framework transfer your cache to the browser.
 *
 * The framework will call `serializeCache` on the server to serialize the cache to a string and inject it into the dom.
 * The framework will then call `initializeCache` on the browser with the serialized cache string to initialize the cache.
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should not see any network calls to the people API when visiting the /appWithSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */

//Use JSON stringify to convert object into string
export const serializeCache = (): string => {
  return JSON.stringify(cache);
};

//reassign cache to serialized cache
export const initializeCache = (serializedCache: string): void => { 
  Object.assign(cache, JSON.parse(serializedCache));
};

//clear cache function. Empty cache keys.
export const wipeCache = (): void => {
  Object.keys(cache).forEach((url) => delete cache[url]);
 };