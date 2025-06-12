import { localStorage } from './storageService';
import { isEventeli } from '@/config';

type ModuleType = 'trends' | 'search';

interface SearchParams {
  [key: string]: string | undefined;
}

interface SearchEvent {
  date: string;
  fullPath: string;
  path: string;
  params: SearchParams;
  groupedParams?: Record<string, any>;
  timestamp?: number;
}

interface RecentSearch {
  id: string;
  query: string;
  timestamp: number;
  searchEvent: SearchEvent;
  filters?: Record<string, any>;
  metadata?: Record<string, any>;
}

interface RecentSearchOptions {
  maxItems: number;
  module: ModuleType;
}

const DEFAULT_OPTIONS: Required<RecentSearchOptions> = {
  maxItems: 10,
  module: 'search'
};

const generateStorageKey = (module: ModuleType): string => {
  const platform = isEventeli ? 'geo' : 'gtm';
  return `whr.${platform}.history.${module}`;
};

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const createRecentSearch = (
  query: string,
  searchEvent: SearchEvent,
  filters?: Record<string, any>,
  metadata?: Record<string, any>
): RecentSearch => ({
  id: generateId(),
  query,
  timestamp: Date.now(),
  searchEvent: {
    ...searchEvent,
    timestamp: Date.now()
  },
  filters,
  metadata,
});

const getRecentSearches = (options: Partial<RecentSearchOptions> = {}): RecentSearch[] => {
  const { module } = { ...DEFAULT_OPTIONS, ...options };
  const storageKey = generateStorageKey(module);
  return localStorage.get<RecentSearch[]>(storageKey) || [];
};

const addRecentSearch = (
  query: string,
  searchEvent: SearchEvent,
  filters?: Record<string, any>,
  metadata?: Record<string, any>,
  options: Partial<RecentSearchOptions> = {}
): RecentSearch[] => {
  const { maxItems, module } = { ...DEFAULT_OPTIONS, ...options };
  const storageKey = generateStorageKey(module);
  
  // Get existing searches
  const searches = getRecentSearches(options);
  
  // Create new search
  const newSearch = createRecentSearch(query, searchEvent, filters, metadata);
  
  // Remove duplicate queries
  const filteredSearches = searches.filter(search => search.query !== query);
  
  // Add new search at the beginning
  const updatedSearches = [newSearch, ...filteredSearches].slice(0, maxItems);
  
  // Save to storage
  localStorage.set(storageKey, updatedSearches);
  
  return updatedSearches;
};

const removeRecentSearch = (id: string, options: Partial<RecentSearchOptions> = {}): RecentSearch[] => {
  const { module } = { ...DEFAULT_OPTIONS, ...options };
  const storageKey = generateStorageKey(module);
  const searches = getRecentSearches(options);
  const updatedSearches = searches.filter(search => search.id !== id);
  
  localStorage.set(storageKey, updatedSearches);
  return updatedSearches;
};

const clearRecentSearches = (options: Partial<RecentSearchOptions> = {}): void => {
  const { module } = { ...DEFAULT_OPTIONS, ...options };
  const storageKey = generateStorageKey(module);
  localStorage.remove(storageKey);
};

const updateRecentSearch = (
  id: string,
  updates: Partial<RecentSearch>,
  options: Partial<RecentSearchOptions> = {}
): RecentSearch[] => {
  const { module } = { ...DEFAULT_OPTIONS, ...options };
  const storageKey = generateStorageKey(module);
  const searches = getRecentSearches(options);
  
  const updatedSearches = searches.map(search => 
    search.id === id 
      ? { ...search, ...updates, timestamp: Date.now() }
      : search
  );
  
  localStorage.set(storageKey, updatedSearches);
  return updatedSearches;
};

const searchRecentSearches = (
  searchTerm: string,
  options: Partial<RecentSearchOptions> = {}
): RecentSearch[] => {
  const searches = getRecentSearches(options);
  const term = searchTerm.toLowerCase();
  
  return searches.filter(search => 
    search.query.toLowerCase().includes(term) ||
    search.searchEvent.path.toLowerCase().includes(term) ||
    Object.values(search.searchEvent.params).some(value => 
      value?.toLowerCase().includes(term)
    ) ||
    search.metadata?.tags?.some((tag: string) => tag.toLowerCase().includes(term))
  );
};

const getRecentSearchById = (
  id: string,
  options: Partial<RecentSearchOptions> = {}
): RecentSearch | undefined => {
  const searches = getRecentSearches(options);
  return searches.find(search => search.id === id);
};

// Module-specific convenience methods
const getTrendsHistory = (options: Partial<RecentSearchOptions> = {}): RecentSearch[] => {
  return getRecentSearches({ ...options, module: 'trends' });
};

const getSearchHistory = (options: Partial<RecentSearchOptions> = {}): RecentSearch[] => {
  return getRecentSearches({ ...options, module: 'search' });
};

const addToTrendsHistory = (
  query: string,
  searchEvent: SearchEvent,
  filters?: Record<string, any>,
  metadata?: Record<string, any>,
  options: Partial<RecentSearchOptions> = {}
): RecentSearch[] => {
  return addRecentSearch(query, searchEvent, filters, metadata, { ...options, module: 'trends' });
};

const addToSearchHistory = (
  query: string,
  searchEvent: SearchEvent,
  filters?: Record<string, any>,
  metadata?: Record<string, any>,
  options: Partial<RecentSearchOptions> = {}
): RecentSearch[] => {
  return addRecentSearch(query, searchEvent, filters, metadata, { ...options, module: 'search' });
};

// Export the service functions
export const recentSearchService = {
  // Core methods
  add: addRecentSearch,
  remove: removeRecentSearch,
  clear: clearRecentSearches,
  update: updateRecentSearch,
  getAll: getRecentSearches,
  search: searchRecentSearches,
  getById: getRecentSearchById,
  
  // Module-specific methods
  getTrendsHistory,
  getSearchHistory,
  addToTrendsHistory,
  addToSearchHistory,
};

export type { RecentSearch, RecentSearchOptions, ModuleType, SearchEvent, SearchParams };
export default recentSearchService; 