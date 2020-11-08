import { useQuery } from '@reactstack/svelte-query'
import axios from 'axios'

async function getPosts() {
    const { data } = await axios.get(
        'https://jsonplaceholder.typicode.com/posts'
    )
    return data
}

const usePosts = () => {
    return useQuery('posts', getPosts)
}

export default usePosts