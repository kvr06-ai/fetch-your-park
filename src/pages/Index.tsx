import { useState } from "react";
import LocationSearch from "../components/LocationSearch";
import ParkCard from "../components/ParkCard";
import { DogPark } from "../types/dogPark";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";

const ITEMS_PER_PAGE = 12;

const fetchDogParks = async ({ searchLocation, page }: { searchLocation?: string, page: number }) => {
  let query = supabase
    .from('dog_parks')
    .select('*', { count: 'exact' })
    .gte('reviews', 10);

  if (searchLocation?.match(/^\d{5}$/)) {
    query = query.eq('postal_code', searchLocation);
  } else if (searchLocation) {
    query = query.ilike('city', `%${searchLocation}%`);
  }

  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;
  
  const { data, error, count } = await query
    .range(from, to)
    .order('reviews', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  console.log('Total dog parks:', count);
  return { 
    data: data as DogPark[], 
    totalPages: count ? Math.ceil(count / ITEMS_PER_PAGE) : 0,
    totalCount: count || 0
  };
};

const Index = () => {
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['dogParks', searchLocation, currentPage],
    queryFn: () => fetchDogParks({ searchLocation, page: currentPage }),
    enabled: searchPerformed
  });

  const handleSearch = (location: string) => {
    console.log("Searching for:", location);
    setSearchLocation(location);
    setCurrentPage(1);
    setSearchPerformed(true);
  };

  const handleUseMyLocation = () => {
    console.log("Using user's location");
    setSearchPerformed(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F1D2B] via-[#2A2D3E] to-[#1F1D2B]">
      <nav className="bg-[#1F1D2B]/50 backdrop-blur-sm border-b border-white/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#E5DEFF] tracking-tight">PawSpots</h1>
          </div>
        </div>
      </nav>

      <div className="relative min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/e6014daf-4d70-4b74-9f32-e0c75f724fed.png')] bg-cover bg-center opacity-5"></div>
        
        <div className="container px-4 py-16 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-5xl lg:text-7xl font-bold text-[#D3E4FD] mb-6 tracking-tight leading-tight animate-fadeIn">
              Find a Dog Park <br />Near You
            </h1>
            <p className="text-xl text-[#F2FCE2] mb-4 animate-fadeIn font-medium max-w-2xl mx-auto">
              Discover nearby spots for your furry friend to play and socialize
            </p>
            <p className="text-sm text-[#D6BCFA] font-medium mb-12 animate-fadeIn">
              Currently available for United States locations only
            </p>
            
            <LocationSearch
              onSearch={handleSearch}
              onUseMyLocation={handleUseMyLocation}
            />
          </div>
        </div>
      </div>

      {searchPerformed && (
        <div className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="text-center py-12 text-[#E5DEFF] font-medium">Loading dog parks...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-400 font-medium">Error loading dog parks</div>
          ) : (
            <>
              {data?.totalCount === 0 ? (
                <div className="text-center py-12 text-[#D3E4FD] font-medium">
                  No dog parks found in this location. Try searching for a different area.
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <p className="text-[#F2FCE2] font-medium">
                      Found {data?.totalCount} dog parks
                      {searchLocation && ` near ${searchLocation}`}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.data.map((park) => (
                      <ParkCard key={`${park.name}-${park.postal_code}`} {...park} />
                    ))}
                  </div>
                  {data && data.totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : ''} text-[#D3E4FD]`}
                            />
                          </PaginationItem>
                          {[...Array(data.totalPages)].map((_, i) => (
                            <PaginationItem key={i + 1}>
                              <PaginationLink
                                onClick={() => setCurrentPage(i + 1)}
                                isActive={currentPage === i + 1}
                                className="text-[#D3E4FD]"
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setCurrentPage(p => Math.min(data.totalPages, p + 1))}
                              className={`${currentPage === data.totalPages ? 'pointer-events-none opacity-50' : ''} text-[#D3E4FD]`}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Index;
