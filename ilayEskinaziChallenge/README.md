# Caching Fetch Library

## Tasks completed

1 - Implemented a global cache:
    -Defined Cache type
    -Defined Cache entry

2 - Implemented fetch hook (useCachingFetch):
    - fetched data and stored in cache
    - returned isLoading, data, and error
    - returned data from cache when already stored

3 - Implemented preload func (preloadCachingFetch):
    - Made sure data is preloaded before rendering server-side

4 - Made simple serialization func to stringify JSON obj, initialization func to initialize cache from serialized data, and clear cache func at the end to clear cache.