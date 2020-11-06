import { useQuery } from 'svelte-query'
import axios, { AxiosError } from 'axios'


async function getPosts() {
    const { data } = await axios.get(
        'https://jsonplaceholder.typicode.com/posts'
    )
    return data
}

const usePosts = () => {
    return useQuery<
        { id: string; title: string; body: string }[],
        AxiosError
    >('posts', getPosts)
}

export default usePosts