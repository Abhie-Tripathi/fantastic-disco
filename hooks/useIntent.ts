import { useMutation } from "@tanstack/react-query";
import { useIntentService } from "@/services/intentService";
import { CreateUserEventInterest } from "@/types/intent";

export const intentKeys = {
  all: ["intent"] as const,
  userEventInterest: () => [...intentKeys.all, "userEventInterest"] as const,
};

export const useIntent = {
  createUserEventInterest: () => {
    const intentService = useIntentService();
    const mutation = useMutation({
      mutationFn: (data: CreateUserEventInterest) =>
        intentService.createUserEventInterest(data),
    });
    return {
      createUserEventInterest: mutation.mutate,
      isLoading: mutation.isPending,
      error: mutation.error,
      isSuccess: mutation.isSuccess,
      reset: mutation.reset,
    };
  },

  updateUserEventInterest: () => {
    const intentService = useIntentService();
    const mutation = useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string;
        data: Partial<CreateUserEventInterest>;
      }) => intentService.updateUserEventInterest(id, data),
    });

    return {
      updateUserEventInterest: mutation.mutate,
      isLoading: mutation.isPending,
      error: mutation.error,
      isSuccess: mutation.isSuccess,
      reset: mutation.reset,
    };
  },

  deleteUserEventInterest: () => {
    const intentService = useIntentService();
    const mutation = useMutation({
      mutationFn: (id: string) => intentService.deleteUserEventInterest(id),
    });

    return {
      deleteUserEventInterest: mutation.mutate,
      isLoading: mutation.isPending,
      error: mutation.error,
      isSuccess: mutation.isSuccess,
      reset: mutation.reset,
    };
  }
};
