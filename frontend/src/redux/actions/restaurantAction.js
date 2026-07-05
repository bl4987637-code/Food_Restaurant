import api from "../../utils/api"

import{
    getRestaurantsRequest,
    getRestaurantsSuccess,
    getRestaurantsFail,

    createRestaurantRequest,
    createRestaurantSuccess,
    createRestaurantFail,

    deleteRestaurantRequest,
    deleteRestaurantSuccess,
    deleteRestaurantFail,

    generateSummaryRequest,
    generateSummarySuccess,
    generateSummaryFail,

} from "../slices/restaurantSlice"

//get
export const getRestaurants =(keyword="") => async(dispatch) =>{
    try{
     dispatch(getRestaurantsRequest());
     // Only pass keyword if it's a real non-empty string (avoid sending "undefined" as a string)
     const validKeyword = keyword && keyword !== "undefined" ? keyword : "";
     const url = validKeyword
       ? `/v1/eats/stores?keyword=${validKeyword}`
       : `/v1/eats/stores`;
     const {data} = await api.get(url);
     dispatch(getRestaurantsSuccess({
        restaurants:data.restaurant,
        count:data.count
     }))
    }catch(error){
      dispatch(getRestaurantsFail(error.response?.data?.message || error.message))
    }
}

export const generateReviewSummary = (restaurantId) => async (dispatch) => {
  try {
    dispatch(generateSummaryRequest(restaurantId));

    const { data } = await api.get(
      `/v1/eats/stores/${restaurantId}/ai-summary`
    );

    dispatch(
      generateSummarySuccess({
        id: restaurantId,
        summary: data.data,
      })
    );
  } catch (error) {
    dispatch(
      generateSummaryFail({
        id: restaurantId,
        error: error.response?.data?.message || error.message,
      })
    );
  }
};

//create
export const createRestaurant = (restaurantData) => async(dispatch)=>{
    try{
       dispatch(createRestaurantRequest())

       const {data} = await api.post("/v1/eats/stores", restaurantData);

       dispatch(createRestaurantSuccess(data.data));

    }
    catch(error){
     dispatch(createRestaurantFail(error.response?.data?.message || error.message))
    }
}

//delete
export const deleteRestaurant = (id) => async(dispatch)=>{
    try{
       dispatch(deleteRestaurantRequest())

      await api.delete(`/v1/eats/stores/${id}`);

       dispatch(deleteRestaurantSuccess(id));

    }
    catch(error){
     dispatch(deleteRestaurantFail(error.response?.data?.message || error.message))
    }
}
