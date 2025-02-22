# Data Processing Scripts

This directory contains scripts for processing and enriching the dog park dataset.

## Scripts

### enrich_dog_parks.py

This script enriches the raw dog park data with additional useful information:

- Operating hours analysis
- Popular times analysis
- Amenities detection
- Rating analysis
- Location information

#### Usage

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the script:
```bash
python enrich_dog_parks.py
```

The script expects a CSV file named "Outscraper-20250215083523b6a_dog_park (1).csv" in the same directory.
It will output an enriched dataset as "enriched_dog_parks.csv".

#### Output Columns

The enriched dataset includes:

1. Basic Information:
   - name: Park name
   - address: Full address
   - city: City location
   - state: State location
   - latitude, longitude: Coordinates
   - website: Official website
   - phone: Contact number
   - status: Operating status

2. Visual Information:
   - main_photo_url: Primary photo
   - street_view_url: Street view image

3. Ratings & Reviews:
   - rating: Average rating
   - review_count: Number of reviews
   - review_confidence: Weighted rating score
   - positive_review_percentage: Percentage of 4-5 star reviews
   - features: Common features mentioned in reviews

4. Operating Hours:
   - is_24_hours: 24/7 operation flag
   - hours_per_week: Total weekly operating hours
   - operating_hours: Formatted hours string

5. Popular Times:
   - busiest_day: Most crowded day
   - busiest_hour: Peak hour
   - best_time_to_visit: Recommended quiet time

6. Amenities (all boolean):
   - has_restroom: Restroom facilities
   - has_parking: Parking availability
   - has_water: Water features/fountains
   - has_shade: Shaded areas
   - has_benches: Seating areas
   - has_picnic_area: Picnic facilities
   - wheelchair_accessible: Accessibility features
   - good_for_kids: Family-friendly
   - off_leash_allowed: Off-leash area
   - amenities_score: Overall amenities rating 