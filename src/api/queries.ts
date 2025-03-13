// get slider images
import { PUB_API_CLIENT } from "./apiClient";

export const getSliderImages = async () => {
  try {
    const res = await PUB_API_CLIENT.get("/slider");
    if (res.status === 200) {
      const responseData = res.data?.data;
      const slidesImages: string[] = [];

      responseData.forEach((current: any) => {
        slidesImages.push(current.url);
      });

      return slidesImages;
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
