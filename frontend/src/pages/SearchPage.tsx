import { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { searchItems, getSuggestions } from '../services/api';
import { SearchResponse, Item } from '../types';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../components/ui/toast';
import { Search, ListFilter, SlidersHorizontal, PackageOpen } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination';

export default function SearchPage() {
  const { toast } = useToast();
  // State
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400); // 400ms debounce
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('relevance');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch items based on active criteria
  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await searchItems({ q: debouncedQuery, category, sort, page, limit });
      setData(response);
    } catch (err: any) {
      toast({
        title: 'Error fetching results',
        description: err.response?.data?.error || err.message || 'Server error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Fetch autocomplete suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length >= 2) {
        try {
          const res = await getSuggestions(debouncedQuery);
          setSuggestions(res);
        } catch (e) {
          // Silent catch for suggestions
        }
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  // Trigger main search fetch on parameter changes
  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, category, sort, page, limit]);

  // Handlers
  const handleSuggestionClick = (s: string) => {
    setQuery(s);
    setShowSuggestions(false);
    setPage(1);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
    setPage(1); // Reset to page 1 on new search
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-12">
      {/* Header / Search Bar area */}
      <header className="sticky top-0 z-30 bg-background border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <PackageOpen className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                CloudSearch
              </h1>
            </div>
            
            <div className="relative flex-1 w-full max-w-2xl mx-auto">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products, brands, models..."
                value={query}
                onChange={handleQueryChange}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => setShowSuggestions(true)}
                className="pl-10 h-12 text-md shadow-sm rounded-full"
              />
              
              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-14 left-0 right-0 bg-popover text-popover-foreground border rounded-lg shadow-lg z-50 overflow-hidden">
                  <ul className="flex flex-col">
                    {suggestions.map((s, idx) => (
                      <li 
                        key={idx}
                        className="px-4 py-3 hover:bg-accent cursor-pointer text-sm"
                        onClick={() => handleSuggestionClick(s)}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ListFilter className="h-4 w-4" />
                <h3 className="font-medium">Category</h3>
              </div>
              <Select 
                value={category} 
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              >
                <option value="All">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Home">Home</option>
                <option value="Toys">Toys</option>
                <option value="Sports">Sports</option>
              </Select>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal className="h-4 w-4" />
                <h3 className="font-medium">Sort By</h3>
              </div>
              <Select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
                <option value="relevance">Relevance</option>
                <option value="newest">Newest Arrivals</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </Select>
            </div>

            <div>
              <h3 className="font-medium mb-3">Items per page</h3>
              <Select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </Select>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {loading ? 'Searching...' : `Found ${data?.totalCount || 0} results`}
              </h2>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full rounded-none" />
                    <CardHeader>
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : data?.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed rounded-lg bg-background">
                <Search className="h-12 w-12 mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground">No matches found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
                <Button variant="outline" className="mt-4" onClick={() => { setQuery(''); setCategory('All'); }}>Clear filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.items.map((item: Item) => (
                  <Card key={item._id} className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group rounded-xl border-border/40 bg-card/60">
                    <div className="h-48 w-full bg-muted flex items-center justify-center overflow-hidden relative">
                      <Badge className="absolute top-3 right-3 bg-background/80 text-foreground backdrop-blur-sm shadow-sm ring-1 ring-border border-0 z-10">
                        {item.category}
                      </Badge>
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                    </div>
                    <CardHeader className="flex-1 pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg leading-tight mt-1 line-clamp-1">{item.title}</CardTitle>
                      </div>
                      <CardDescription className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        ${item.price.toFixed(2)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      {item.score && (
                        <p className="text-xs text-muted-foreground mt-3">
                          Relevance: <span className="font-medium text-foreground">{item.score.toFixed(2)}</span>
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0 mt-auto flex items-center justify-between opacity-90 pb-3">
                      <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        By {item.brand || 'Unknown'}
                      </span>
                      {item.isAvailable ? (
                        <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-0.5 rounded-full">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 px-2.5 py-0.5 rounded-full">
                          Out of Stock
                        </span>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && data && data.totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        variant="ghost" 
                        disabled={page === 1} 
                        onClick={() => setPage(page - 1)}
                      >
                        <PaginationPrevious className="bg-transparent border-0 shadow-none hover:bg-transparent" />
                      </Button>
                    </PaginationItem>
                    
                    <span className="mx-4 text-sm text-muted-foreground font-medium">
                      Page {page} of {data.totalPages}
                    </span>

                    <PaginationItem>
                      <Button
                        variant="ghost" 
                        disabled={page === data.totalPages} 
                        onClick={() => setPage(page + 1)}
                      >
                        <PaginationNext className="bg-transparent border-0 shadow-none hover:bg-transparent" />
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
