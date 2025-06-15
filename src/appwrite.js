import { Client, Databases, ID, Query } from 'appwrite'

const PROJECT_ID=import.meta.env.VITE_APPWRITE_PROJECT_ID
const DATABASE_ID=import.meta.env.VITE_APPWRITE_DB_ID
const COLLECTION_ID=import.meta.env.VITE_APPWRITE_COLLECTION_ID
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID)

const DB = new Databases(client);

export const updateSearchCount = async (searchTerm, movie)=>{
    try {
        const result = await DB.listDocuments(DATABASE_ID,COLLECTION_ID,[
            Query.equal("SearchTerm",searchTerm)
        ])

        if (result.documents.length > 0) {
            const doc = result.documents[0];

            await DB.updateDocument(DATABASE_ID,COLLECTION_ID,doc.$id,{
                count: doc.count + 1
            })
        }else{
            await DB.createDocument(DATABASE_ID,COLLECTION_ID,ID.unique(),{
                SearchTerm: searchTerm,
                count: 1,
                movie_id:movie.id,
                poster_URL: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })
        }
    } catch (error) {
        console.error(error)
    }
}

export const getTrendingMovies = async ()=>{
    try {
        const result = await DB.listDocuments(DATABASE_ID,COLLECTION_ID,[
            Query.limit(5),
            Query.orderDesc("count")
        ])
        return result.documents;
    } catch (error) {
        console.error(error);
    }
}