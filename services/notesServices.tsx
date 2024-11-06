import { useApi } from '@/hooks/useApi';
import { endpoints } from "@/config/endpoints";
import { NotesResponse, Comment  } from '@/types/comment';
import { UserResponse } from '@/types/user';

export const useNotesServices =() =>{
    const api = useApi();
    const getNotesFromTracker=(trackerId?:string, params?:string): Promise<NotesResponse | undefined>=>{
        return api.request(
          `${endpoints.tracker.getNotes}&entityId=${trackerId}&${params}`
        )
      }
      const saveNotes=(formData:any, replyId:string | null): Promise<{data: Comment }| undefined>=>{
        return api.request(
          `${endpoints.tracker.saveNotes}${replyId!==null ? '/reply':''}`,
          {
            method: 'POST',
            data: formData
          }
        )
      }
      const deleteNotes=(id:string)=>{
        return api.request(
          `${endpoints.tracker.saveNotes}/${id}`,
          {
            method: "DELETE"
          }
        )
      }
      const likeNotes=(id: string, isLiked: boolean)=>{
        return api.request(
          `${endpoints.tracker.saveNotes}/${id}/interest`,
          {
            method: "POST"
          }
        )
      }
      const getUsers=(params: string): Promise<{users: UserResponse[] }| undefined>=>{
        return api.request(
          `${endpoints.users}?${params}`,
          {
            method: "GET"
          }
        )
      }
    return{
        getNotesFromTracker,
        saveNotes,
        deleteNotes,
        likeNotes,
        getUsers,
        isLoading: api.isLoading,
      error: api.error,
    }
}