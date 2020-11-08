import { useQuery } from '@tanstack/svelte-query'
import axios from 'axios'

const getPostById = async (id) => {
    const { data } = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${id}`
    )
    return data
}

const usePost = (postId) => {
    return useQuery(
        ['post', postId],
        () => getPostById(postId),
        {
            enabled: !!postId,
        })
}

export default usePost