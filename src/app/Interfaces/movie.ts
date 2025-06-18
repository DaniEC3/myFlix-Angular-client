export interface Movie {
  _id: string;
  name: string;
  description: string;
  genre: string;       // Populated reference
  director: string; // Populated reference
  year_released?: string; // ISO date format (e.g. "2025-06-18")
  imagePath?: string;
}