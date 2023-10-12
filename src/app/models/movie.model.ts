export interface Movie {
  title: string;
  description: string;
  genres: string[];
  releaseDate: Date;
  coverUrl: string;
  id: number;
  rating: number;
  coverBase64?: string | ArrayBuffer;
}
