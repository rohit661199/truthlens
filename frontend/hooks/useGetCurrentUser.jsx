import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../src/config";

// IMPORTANT: This hook must be called inside a React component, not in plain JS or outside a component tree.

function useGetCurrentUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/user/current`,
          { withCredentials: true }
        );

        dispatch(setUserData(data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [dispatch]);
}

export default useGetCurrentUser;
