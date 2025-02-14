
import { DogPark, formatWorkingHours } from "../types/dogPark";

export const dogParks: DogPark[] = [
  {
    name: "St. Johns Community Dog Park",
    site: "http://stjucc.org/",
    phone: "+1 314-892-0848",
    full_address: "11333 St John Church Rd, St. Louis, MO 63123",
    street: "11333 St John Church Rd",
    city: "St. Louis",
    postal_code: "63123",
    state: "Missouri",
    country: "United States of America",
    reviews: 76,
    photo: "https://lh5.googleusercontent.com/p/AF1QipNQg5Fgh-cgMBprUPMhFHultzN39cMOnrg6FYUj=w800-h500-k-no",
    street_view: "https://lh5.googleusercontent.com/p/AF1QipNQg5Fgh-cgMBprUPMhFHultzN39cMOnrg6FYUj=w1600-h1000-k-no",
    working_hours: formatWorkingHours('{"Monday": "6:30AM-7PM", "Tuesday": "6:30AM-7PM", "Wednesday": "6:30AM-7PM", "Thursday": "6:30AM-7PM", "Friday": "6:30AM-7PM", "Saturday": "6:30AM-7PM", "Sunday": "6:30AM-7PM"}'),
    business_status: "OPERATIONAL",
    location_link: "https://www.google.com/maps/place/St.+Johns+Community+Dog+Park/@38.5140033,-90.3378692,14z/data=!4m8!1m2!2m1!1sSt.+Johns+Community+Dog+Park!3m4!1s0x87d8c9ac229b24ed:0x68aa02e06a6b4ea9!8m2!3d38.5140033!4d-90.3378692"
  },
  // ... Add all other parks here similarly
];
