import { useQuery } from 'svelte-query'
import axios, { AxiosError } from 'axios'


const getPostById = async (id) => {
    const { data } = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${id}`
    )
    return data
}

const usePost = (postId: string) => {
    return useQuery<{ title: string; body: string }, AxiosError>(
        ['post', postId],
        () => getPostById(postId),
        {
            enabled: !!postId,
        })
}

export default usePost