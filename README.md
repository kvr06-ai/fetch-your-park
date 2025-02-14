
# PawSpots: Dog Park Finder Application

## Overview

PawSpots is a modern web application that helps users find dog parks in their vicinity. Built with React, TypeScript, and Supabase, it provides a user-friendly interface for discovering and learning about dog parks across the United States.

## Technical Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom configuration
- **UI Components**: shadcn/ui component library
- **Database**: Supabase
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Key Features

1. **Location-based Search**
   - City name search
   - ZIP code search
   - Geolocation support (planned)

2. **Dog Park Listings**
   - Curated list of verified dog parks (10+ reviews)
   - Pagination support (12 items per page)
   - Detailed information including:
     - Park name and address
     - Operating hours
     - Website links
     - Contact information

3. **Responsive Design**
   - Mobile-first approach
   - Adaptive layout for all screen sizes
   - Smooth animations and transitions

## Project Structure

```
src/
├── components/
│   ├── LocationSearch.tsx    # Search input component
│   ├── ParkCard.tsx         # Dog park card component
│   └── ui/                  # shadcn/ui components
├── pages/
│   ├── Index.tsx            # Main landing page
│   └── NotFound.tsx         # 404 page
├── types/
│   ├── dogPark.ts          # Dog park type definitions
│   └── user.ts             # User type definitions
└── lib/
    └── supabase.ts         # Supabase client configuration
```

## Data Model

### Dog Park Schema
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

## Quality Assurance

- **Data Quality**: Only displays dog parks with 10 or more reviews to ensure data reliability
- **Error Handling**: Comprehensive error states for failed queries
- **Loading States**: Clear loading indicators during data fetching
- **Empty States**: User-friendly messages when no results are found

## Performance Optimizations

1. **Query Optimization**
   - Pagination to limit data transfer
   - Efficient filtering at the database level

2. **UI Performance**
   - Lazy loading of images
   - Optimized animations using CSS transitions
   - Debounced search inputs

## Future Enhancements

1. User Authentication
2. Favorite Parks Feature
3. User Reviews and Ratings
4. Advanced Filtering Options
5. Photo Gallery for Each Park
6. Directions Integration

## Local Development

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

4. Open http://localhost:8080 in your browser

## Environment Variables

Required environment variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
