import { useState, useEffect, useCallback } from 'react';

const useLoadingState = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedAssets, setLoadedAssets] = useState({
    textures: 0,
    images: 0,
    models: 0,
    svgs: 0,
    total: 0
  });
  const [loadingComplete, setLoadingComplete] = useState(false);

  const updateProgress = useCallback((progress, assets) => {
    setLoadingProgress(progress);
    if (assets) {
      setLoadedAssets(assets);
    }
  }, []);

  const setLoadingStatus = useCallback((status) => {
    setIsLoading(status);
    if (!status) {
      setLoadingComplete(true);
    }
  }, []);

  const resetLoading = useCallback(() => {
    setLoadingProgress(0);
    setIsLoading(true);
    setLoadingComplete(false);
    setLoadedAssets({
      textures: 0,
      images: 0,
      models: 0,
      svgs: 0,
      total: 0
    });
  }, []);

  // Log when loading is complete
  useEffect(() => {
    if (loadingComplete) {
      console.log('🎊 LOADING STATE: All assets loaded successfully!');
      console.log('📊 Final loading state:', {
        progress: loadingProgress,
        assets: loadedAssets,
        complete: loadingComplete
      });
    }
  }, [loadingComplete, loadingProgress, loadedAssets]);

  return {
    loadingProgress,
    isLoading,
    loadedAssets,
    loadingComplete,
    updateProgress,
    setLoadingStatus,
    resetLoading
  };
};

export default useLoadingState; 