import useStreamCollection from "./useStreamCollection";

const useAlbums = (userId) => {
  return useStreamCollection(`users/${userId}/albums`);
};

export default useAlbums;
