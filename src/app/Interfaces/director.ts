export interface Director {
  _id: string;
  name: string;               // required
  bio: string;                // required
  birthYear: string;          // required (ISO format date)
  deathYear?: string;         // optional
}
