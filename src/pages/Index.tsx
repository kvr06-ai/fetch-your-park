
import { useState } from "react";
import LocationSearch from "../components/LocationSearch";
import ParkCard from "../components/ParkCard";
import { Dog, Map, Star, Info } from "lucide-react";
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

const NavigationItem = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <button className="flex items-center gap-2 px-6 py-3 rounded-full hover:bg-black/5 transition-colors duration-200">
    <Icon size={20} />
    <span className="font-medium">{text}</span>
  </button>
);

const fetchDogParks = async ({ searchLocation, page }: { searchLocation?: string, page: number }) => {
  let query = supabase
    .from('dog_parks')
    .select('*', { count: 'exact' });

  // If searchLocation is provided and looks like a zip code (5 digits)
  if (searchLocation?.match(/^\d{5}$/)) {
    query = query.eq('postal_code', searchLocation);
  } else if (searchLocation) {
    // If it's not a zip code, search by city
    query = query.ilike('city', `%${searchLocation}%`);
  }

  // Add pagination
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;
  
  const { data, error, count } = await query
    .range(from, to)
    .order('name');
  
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
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 bg-gradient-to-r from-white to-secondary/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">PawSpots</h1>
          </div>
        </div>
      </nav>

      <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-secondary/90 to-accent/90">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/e6014daf-4d70-4b74-9f32-e0c75f724fed.png')] bg-cover bg-center opacity-20"></div>
        
        <div className="container px-4 py-12 lg:py-24 relative">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-fadeIn">
              Find the Perfect Dog Park
            </h1>
            <p className="text-xl text-white/90 mb-12 animate-fadeIn">
              Discover nearby spots for your furry friend to play and socialize
            </p>
            
            <LocationSearch
              onSearch={handleSearch}
              onUseMyLocation={handleUseMyLocation}
            />
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-gradient-to-r from-white via-secondary/5 to-white">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 py-2 no-scrollbar">
            <NavigationItem icon={Dog} text="Dog Parks" />
            <NavigationItem icon={Map} text="Dog Beaches" />
            <NavigationItem icon={Star} text="Top Rated" />
            <NavigationItem icon={Info} text="Resources" />
          </div>
        </div>
      </div>

      {searchPerformed && (
        <div className="container mx-auto px-4 py-12 bg-gradient-to-b from-transparent to-secondary/5">
          {isLoading ? (
            <div className="text-center py-12">Loading dog parks...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">Error loading dog parks</div>
          ) : (
            <>
              {data?.totalCount === 0 ? (
                <div className="text-center py-12">
                  No dog parks found in this location. Try searching for a different area.
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <p className="text-muted-foreground">
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
                              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                          </PaginationItem>
                          {[...Array(data.totalPages)].map((_, i) => (
                            <PaginationItem key={i + 1}>
                              <PaginationLink
                                onClick={() => setCurrentPage(i + 1)}
                                isActive={currentPage === i + 1}
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setCurrentPage(p => Math.min(data.totalPages, p + 1))}
                              className={currentPage === data.totalPages ? 'pointer-events-none opacity-50' : ''}
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
