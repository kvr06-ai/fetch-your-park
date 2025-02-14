
# PawSpots: Dog Park Finder Application

## Technical Architecture Documentation

### Overview
PawSpots is a modern web application designed to help users discover and explore dog parks across the United States. Built with React and TypeScript, it leverages real-time data from Google Maps via Outscraper to provide up-to-date information about dog parks, including reviews, operating hours, and amenities.

### Core Technologies

#### Frontend Stack
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom configuration
- **UI Components**: shadcn/ui library
- **State Management**: TanStack Query (React Query) v5
- **Data Fetching**: Supabase Client
- **Icons**: Lucide React

#### Backend Infrastructure
- **Database**: Supabase PostgreSQL
- **API Layer**: Supabase REST API
- **Data Updates**: Automated Google Maps data scraping via Outscraper
- **Authentication**: Supabase Auth (planned)

### Data Architecture

#### Dog Park Schema
```typescript
interface DogPark {
  name: string;
  site: string;
  phone: string;
  full_address: string;
  street: string;
  city: string;
  postal_code: string;
  state: string;
  country: string;
  reviews: number;
  photo: string;
  street_view: string;
  working_hours: WorkingHours | null;
  business_status: 'OPERATIONAL' | 'CLOSED' | string;
  location_link: string;
}
```

#### Data Flow
1. Initial data collection via Outscraper Google Maps scraper
2. Data cleaning and normalization
3. Storage in Supabase PostgreSQL database
4. Real-time querying via Supabase client
5. Client-side caching with TanStack Query

### Key Features Implementation

#### 1. Location-based Search
- **Implementation**: Custom search component with city and ZIP code support
- **Validation**: Regex pattern matching for ZIP codes
- **Query Building**: Dynamic Supabase query construction based on search type
```typescript
if (searchLocation?.match(/^\d{5}$/)) {
  query = query.eq('postal_code', searchLocation);
} else if (searchLocation) {
  query = query.ilike('city', `%${searchLocation}%`);
}
```

#### 2. Pagination System
- **Architecture**: Server-side pagination
- **Page Size**: 12 items per page
- **Implementation**: Range-based queries with Supabase
```typescript
const from = (page - 1) * ITEMS_PER_PAGE;
const to = from + ITEMS_PER_PAGE - 1;
```

#### 3. Data Quality Assurance
- Minimum review threshold (10+ reviews)
- Business status validation
- Working hours parsing and validation
- Address normalization

#### 4. UI/UX Implementation
- **Theme**: Custom dark theme with gradient backgrounds
- **Color Palette**:
  - Primary Background: `#1F1D2B` to `#2A2D3E` gradient
  - Text Colors: 
    - Headers: `#E5DEFF` (soft purple)
    - Body: `#D3E4FD` (soft blue)
    - Accents: `#F2FCE2` (soft green)
    - Secondary: `#D6BCFA` (light purple)
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Animations**: Custom fade-in and slide-up animations

### Performance Optimizations

#### 1. Query Optimization
- **Implementation**: Server-side filtering
- **Caching Strategy**: TanStack Query with custom cache keys
```typescript
queryKey: ['dogParks', searchLocation, currentPage]
```

#### 2. UI Performance
- Lazy loading of images
- Debounced search inputs
- Optimized re-renders with proper React hooks usage
- Efficient pagination implementation

### Data Collection Process

#### Google Maps Data Scraping
- **Tool**: Outscraper API
- **Data Points Collected**:
  - Business details
  - Location information
  - Operating hours
  - Reviews and ratings
  - Photos and street view links
- **Update Frequency**: Weekly data refresh
- **Validation**: Automated data quality checks

### Security Measures

#### Database Security
- Row Level Security (RLS) policies
- Restricted API access
- Data validation at both client and server levels

#### API Security
- Rate limiting
- Request validation
- Error handling and logging

### Future Enhancements

1. **User Authentication**
   - Supabase Auth integration
   - Social login options
   - User profiles

2. **Advanced Features**
   - Favorite parks
   - User reviews
   - Real-time updates
   - Directions integration

3. **Performance Improvements**
   - Image optimization
   - Progressive Web App (PWA)
   - Offline support

### Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd pawspots
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Deployment

The application is configured for deployment on various platforms:
- Vercel
- Netlify
- GitHub Pages

### Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### License

This project is licensed under the MIT License - see the LICENSE file for details.
