export interface User {
  _id: string;
  userName: string;
  password: string;
  first_Name?: string;
  last_Name?: string;
  email: string;
  birthDay?: string;
  FavoriteMovies?: string[]; 
}
