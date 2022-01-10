import useStreamCollection from "./useStreamCollection";

const useAlbumsByUser = (userId) => {
  return useStreamCollection(`users/${userId}/albums`);
};

export default useAlbumsByUser;
