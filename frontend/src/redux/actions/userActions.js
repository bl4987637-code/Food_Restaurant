import api from "../../utils/api";

//login
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: "USER_LOGIN_REQUEST" });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await api.post(
      "/v1/users/login",
      { email, password },
      config
    );

    dispatch({
      type: "USER_LOGIN_SUCCESS",
      payload: data.data.user,
    });
  } catch (error) {
    dispatch({
      type: "USER_LOGIN_FAIL",
      payload:
        error.response?.data?.message || error.response?.data?.errMessage ||
        error.message ||
        "Login failed",
    });
  }
};
//load User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "USER_LOAD_REQUEST" });

    const { data } = await api.get("/v1/users/me");

    dispatch({
      type: "USER_LOAD_SUCCESS",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "USER_LOAD_FAIL",
      payload:
        error.response?.data?.message ||
        error.response?.data?.errMessage ||
        error.message ||
        "Unable to load user",
    });
  }
};

//update profile
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: "USER_UPDATE_PROFILE_REQUEST" });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await api.put("/v1/users/me/update", userData, config);

    dispatch({
      type: "USER_UPDATE_PROFILE_SUCCESS",
      payload: data.data.user,
    });
  } catch (error) {
    dispatch({
      type: "USER_UPDATE_PROFILE_FAIL",
      payload:
        error.response?.data?.message ||
        error.response?.data?.errMessage ||
        error.message ||
        "Profile update failed",
    });
  }
};