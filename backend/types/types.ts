interface Movie {
    id: number,
    title: string,
    description: string,
    img_url: string,
    release_year: number,
    genres: Genre[],
    reviews: Review[]
}

interface Genre {
    id: number,
    name: string
}
interface Review {
    id: number,
    userEmail: string,
    message: string,
    rating: number
}

