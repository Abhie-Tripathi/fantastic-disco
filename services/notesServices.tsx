import { useApi } from '@/hooks/useApi';
import { endpoints } from "@/config/endpoints";
import { NotesResponse, Comment  } from '@/types/comment';
import { UserResponse } from '@/types/user';

export const useNotesServices =() =>{
    const api = useApi();
    const getNotesFromTracker=(trackerId?:string, params?:string): Promise<NotesResponse | undefined>=>{
        return api.request(
          `${endpoints.tracker.getNotes}/${trackerId}/comments?${params}`
        )
      }

    const getCoordinateNotes=(enquiryId?:string, params?:string, source?: string): Promise<NotesResponse | undefined>=>{
      return api.request(
        `${endpoints.coordinate.enquiryDetail}/${enquiryId}/${source}/comments?${params}`
      )
    }

      const saveNotes=(formData:any, replyId:string | null): Promise<Comment | undefined>=>{
        return api.request(
          `${endpoints.tracker.saveNotes}`,
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
        if(!isLiked){
        return api.request(
          `${endpoints.tracker.saveNotes}/${id}/upvote`,
          {
            method: "POST",
          }
        )
        }else{
          return api.request(
            `${endpoints.tracker.saveNotes}/${id}/upvote`,
            {
              method: "DELETE",
            }
          )
        }
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
        getCoordinateNotes,
        saveNotes,
        deleteNotes,
        likeNotes,
        getUsers,
        isLoading: api.isLoading,
      error: api.error,
    }
}