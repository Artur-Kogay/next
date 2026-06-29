export interface IAllArtistsModel {
    id: number;
    name: string;
    description: string;
    image: string;
    category: 'singer' | 'artist' | 'comedian';
    slug: string;
};