import { ApiInterface } from "@/interfaces/ApiInterface";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";

export const uploadImageApiCall = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const response: AxiosResponse<ApiInterface<{ imgUrl: string }>> =
    await axios.post("/api/images", formData);
  if (!response.data || !response.data.success) {
    toast.error(response.data.message);
    return;
  }
  return response.data.data?.imgUrl;
};
