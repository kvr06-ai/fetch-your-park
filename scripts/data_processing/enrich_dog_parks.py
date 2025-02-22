import pandas as pd
import json
from datetime import datetime, time
import numpy as np

def parse_working_hours(hours_str):
    """Parse working hours string to structured format"""
    if not isinstance(hours_str, str):
        return None
    try:
        return json.loads(hours_str.replace("'", '"'))
    except:
        return None

def calculate_weekly_hours(hours_dict):
    """Calculate total weekly hours from working hours dictionary"""
    if not hours_dict:
        return 0
    
    total_hours = 0
    for day, hours in hours_dict.items():
        if hours == "Open 24 hours":
            total_hours += 24
        elif hours and hours != "Closed":
            try:
                start, end = hours.split("-")
                start_time = datetime.strptime(start.strip(), "%I:%M%p").time()
                end_time = datetime.strptime(end.strip(), "%I:%M%p").time()
                
                hours_diff = (
                    datetime.combine(datetime.today(), end_time) - 
                    datetime.combine(datetime.today(), start_time)
                ).seconds / 3600
                
                total_hours += hours_diff
            except:
                pass
    return total_hours

def parse_popular_times(times_str):
    """Parse popular times JSON string"""
    if not isinstance(times_str, str):
        return None
    try:
        return json.loads(times_str)
    except:
        return None

def get_peak_times(popular_times):
    """Extract peak day and hour from popular times data"""
    if not popular_times:
        return None, None, None
    
    max_percentage = 0
    min_percentage = 100
    peak_day = None
    peak_hour = None
    best_hour = None
    
    try:
        for day_data in popular_times:
            if isinstance(day_data, dict) and day_data.get('day_text') in ['Saturday', 'Sunday']:  # Focus on weekends
                for hour_data in day_data.get('popular_times', []):
                    percentage = hour_data.get('percentage', 0)
                    if percentage > max_percentage:
                        max_percentage = percentage
                        peak_day = day_data['day_text']
                        peak_hour = hour_data['hour']
                    if percentage < min_percentage and hour_data['hour'] >= 8 and hour_data['hour'] <= 19:
                        min_percentage = percentage
                        best_hour = hour_data['hour']
    except Exception as e:
        print(f"Error processing popular times: {e}")
        return None, None, None
    
    return peak_day, peak_hour, best_hour

def extract_amenities(about_str):
    """Extract detailed amenities from about string"""
    if not isinstance(about_str, str):
        return {}
    
    try:
        about_dict = json.loads(about_str)
        amenities = {}
        
        # Basic amenities
        amenities['has_restroom'] = any(
            'restroom' in key.lower() 
            for section in about_dict.values() 
            for key in section.keys()
        )
        
        amenities['has_parking'] = any(
            'parking' in key.lower() 
            for section in about_dict.values() 
            for key in section.keys()
        )
        
        amenities['has_water'] = any(
            'water' in key.lower() or 'fountain' in key.lower()
            for section in about_dict.values() 
            for key in section.keys()
        )
        
        amenities['has_shade'] = any(
            'shade' in key.lower() or 'covered' in key.lower()
            for section in about_dict.values() 
            for key in section.keys()
        )
        
        amenities['has_benches'] = any(
            'bench' in key.lower() or 'seating' in key.lower()
            for section in about_dict.values() 
            for key in section.keys()
        )
        
        amenities['has_picnic_area'] = any(
            'picnic' in key.lower() 
            for section in about_dict.values() 
            for key in section.keys()
        )
        
        # Accessibility features
        amenities['wheelchair_accessible'] = (
            about_dict.get('Accessibility', {}).get('Wheelchair accessible entrance', False) or
            about_dict.get('Accessibility', {}).get('Wheelchair accessible parking lot', False)
        )
        
        # Additional features
        amenities['good_for_kids'] = about_dict.get('Children', {}).get('Good for kids', False)
        amenities['off_leash_allowed'] = about_dict.get('Pets', {}).get('Dogs allowed', False)
        
        return amenities
    except:
        return {}

def enrich_dog_parks(df):
    """Enrich dog parks dataset with derived columns"""
    
    # Create new dataframe with essential columns
    enriched_df = pd.DataFrame()
    
    # Basic information
    enriched_df['name'] = df['name']
    enriched_df['address'] = df['full_address']
    enriched_df['city'] = df['city']
    enriched_df['state'] = df['state']
    enriched_df['latitude'] = df['latitude']
    enriched_df['longitude'] = df['longitude']
    enriched_df['website'] = df['site']
    enriched_df['phone'] = df['phone']
    enriched_df['status'] = df['business_status']
    
    # Photos
    enriched_df['main_photo_url'] = df['photo']
    enriched_df['street_view_url'] = df['street_view']
    
    # Ratings and reviews
    enriched_df['rating'] = df['rating']
    enriched_df['review_count'] = df['reviews']
    enriched_df['review_confidence'] = np.sqrt(df['reviews']) / 5
    enriched_df['positive_review_percentage'] = (
        (df['reviews_per_score_4'] + df['reviews_per_score_5']) / df['reviews']
    ).fillna(0)
    
    # Operating hours
    df['working_hours_parsed'] = df['working_hours'].apply(parse_working_hours)
    enriched_df['is_24_hours'] = df['working_hours_parsed'].apply(
        lambda x: any(hours == "Open 24 hours" for hours in x.values()) if x else False
    )
    enriched_df['hours_per_week'] = df['working_hours_parsed'].apply(calculate_weekly_hours)
    enriched_df['operating_hours'] = df['working_hours']  # Keep original format for display
    
    # Popular times analysis
    df['popular_times_parsed'] = df['popular_times'].apply(parse_popular_times)
    peak_times = df['popular_times_parsed'].apply(get_peak_times)
    enriched_df['busiest_day'] = peak_times.apply(lambda x: x[0] if x else None)
    enriched_df['busiest_hour'] = peak_times.apply(lambda x: x[1] if x else None)
    enriched_df['best_time_to_visit'] = peak_times.apply(lambda x: x[2] if x else None)
    
    # Extract all amenities
    amenities = df['about'].apply(extract_amenities)
    for key in ['has_restroom', 'has_parking', 'has_water', 'has_shade', 
                'has_benches', 'has_picnic_area', 'wheelchair_accessible',
                'good_for_kids', 'off_leash_allowed']:
        enriched_df[key] = amenities.apply(lambda x: x.get(key, False))
    
    # Calculate amenities score (0-1)
    amenity_columns = [col for col in enriched_df.columns if col.startswith('has_') or col in ['wheelchair_accessible']]
    enriched_df['amenities_score'] = enriched_df[amenity_columns].sum(axis=1) / len(amenity_columns)
    
    # Extract common features from reviews
    enriched_df['features'] = df['reviews_tags'].fillna('')
    
    return enriched_df

if __name__ == "__main__":
    # Read the CSV file
    df = pd.read_csv("Outscraper-20250215083523b6a_dog_park (1).csv")
    
    # Enrich the dataset
    enriched_df = enrich_dog_parks(df)
    
    # Save enriched dataset
    enriched_df.to_csv("enriched_dog_parks.csv", index=False)
    print("Enriched dataset saved to enriched_dog_parks.csv") 