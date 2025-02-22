
import { useState } from "react";
import LocationSearch from "../components/LocationSearch";
import ParkCard from "../components/ParkCard";
import { DogPark, calculateDistance } from "../types/dogPark";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../components/ui/pagination";
import { Button } from "../components/ui/button";
import { Check, Filter } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const ITEMS_PER_PAGE = 12;

const FilterButton = ({ 
  label, 
  isActive, 
  onClick 
}: { 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
}) => (
  <Button
    variant={isActive ? "default" : "outline"}
    className="flex items-center gap-2"
    onClick={onClick}
  >
    {isActive && <Check size={16} />}
    {label}
  </Button>
);

const Index = () => {
  const { toast } = useToast();
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [filters, setFilters] = useState({
    hasWater: false,
    hasBenches: false,
    wheelchairAccessible: false,
    offLeash: false,
  });

  const fetchDogParks = async ({ searchLocation, page }: { searchLocation?: string; page: number }) => {
    let query = supabase
      .from('dog_parks_enriched')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.hasWater) query = query.eq('has_water', true);
    if (filters.hasBenches) query = query.eq('has_benches', true);
    if (filters.wheelchairAccessible) query = query.eq('wheelchair_accessible', true);
    if (filters.offLeash) query = query.eq('off_leash_allowed', true);

    // Improved search logic
    if (searchLocation) {
      const cleanedSearch = searchLocation.trim().toLowerCase();
      
      // Check if it's a ZIP code
      if (cleanedSearch.match(/^\d{5}$/)) {
        query = query.eq('postal_code', cleanedSearch);
      } else {
        // Split location into city and state
        const parts = cleanedSearch.split(',').map(part => part.trim());
        
        if (parts.length > 1) {
          // If there's a comma, search for both city and state
          query = query
            .ilike('city', `%${parts[0]}%`)
            .ilike('state', `%${parts[1]}%`);
        } else {
          // Search in both city and state fields using proper OR filter syntax
          query = query.or(`city.ilike.%${parts[0]}%,state.ilike.%${parts[0]}%`);
        }
      }
    }

    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;
    
    console.log('Search location:', searchLocation);
    console.log('Page:', page);
    console.log('Filters:', filters);
    
    const { data, error, count } = await query
      .range(from, to)
      .order('rating', { ascending: false });
    
    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    console.log('Query results:', { count, results: data });

    // Calculate distances if user location is available
    if (userLocation && data) {
      data.forEach((park: DogPark) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          park.latitude,
          park.longitude
        );
        (park as any).distance = distance;
      });
      
      // Sort by distance
      data.sort((a: any, b: any) => a.distance - b.distance);
    }
    
    return { 
      data: data as DogPark[], 
      totalPages: count ? Math.ceil(count / ITEMS_PER_PAGE) : 0,
      totalCount: count || 0
    };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['dogParks', searchLocation, currentPage, filters, userLocation],
    queryFn: () => fetchDogParks({ searchLocation, page: currentPage }),
    enabled: searchPerformed
  });

  const handleSearch = (location: string) => {
    setSearchLocation(location);
    setCurrentPage(1);
    setSearchPerformed(true);
  };

  const handleUseMyLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setSearchPerformed(true);
          toast({
            title: "Location detected",
            description: "Showing dog parks near you",
          });
        },
        () => {
          toast({
            title: "Location access denied",
            description: "Please enable location access or search by city/zip code",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Please search by city or zip code instead",
        variant: "destructive",
      });
    }
  };

  const toggleFilter = (filter: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
    setCurrentPage(1);
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
              Search by city, state or zip code
            </p>
            
            <LocationSearch
              onSearch={handleSearch}
              onUseMyLocation={handleUseMyLocation}
              isLoading={isLoading}
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
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[#F2FCE2] font-medium text-xl">
                    {data?.totalCount} dog parks found
                    {searchLocation && ` near ${searchLocation}`}
                  </h2>
                  <div className="flex items-center gap-4">
                    <Filter className="text-[#F2FCE2]" size={20} />
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      <FilterButton
                        label="Has Water"
                        isActive={filters.hasWater}
                        onClick={() => toggleFilter('hasWater')}
                      />
                      <FilterButton
                        label="Has Benches"
                        isActive={filters.hasBenches}
                        onClick={() => toggleFilter('hasBenches')}
                      />
                      <FilterButton
                        label="Wheelchair Accessible"
                        isActive={filters.wheelchairAccessible}
                        onClick={() => toggleFilter('wheelchairAccessible')}
                      />
                      <FilterButton
                        label="Off-leash Allowed"
                        isActive={filters.offLeash}
                        onClick={() => toggleFilter('offLeash')}
                      />
                    </div>
                  </div>
                </div>

                {data?.totalCount === 0 ? (
                  <div className="text-center py-12 text-[#D3E4FD] font-medium">
                    No dog parks found matching your criteria. Try adjusting your filters or search for a different location.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.data.map((park) => (
                      <ParkCard 
                        key={`${park.name}-${park.postal_code}`} 
                        {...park} 
                        distance={(park as any).distance}
                      />
                    ))}
                  </div>
                )}

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
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Index;
