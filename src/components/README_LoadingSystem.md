# Loading System Documentation

## Overview
This loading system provides comprehensive tracking of all Three.js asset loading in your React Three Fiber application. It includes both console logging and a visual loading screen.

## Components

### 1. LoadingManager.jsx
**Purpose**: Tracks all asset loading in the Three.js canvas
**Features**:
- Monitors texture loading (THREE.TextureLoader)
- Monitors SVG loading (THREE.SVGLoader) 
- Monitors 3D model loading (THREE.GLTFLoader)
- Monitors image loading (THREE.ImageLoader)
- Provides detailed console logging with emojis for easy identification
- Integrates with the global loading state

**Usage**:
```jsx
<LoadingManager 
  onLoadComplete={handleLoadComplete}
  updateProgress={updateProgress}
  setLoadingStatus={setLoadingStatus}
/>
```

### 2. LoadingScreen.jsx
**Purpose**: Visual loading screen with progress bar
**Features**:
- Modern UI with gradient design
- Real-time progress bar
- Asset count display (textures, images, models, SVGs)
- Responsive design
- Fades out when loading is complete

**Usage**:
```jsx
<LoadingScreen 
  progress={loadingProgress}
  isVisible={isLoading}
  assetCounts={loadedAssets}
/>
```

### 3. useLoadingState.js
**Purpose**: Custom hook for managing loading state
**Features**:
- Centralized loading state management
- Progress tracking
- Asset counting
- Loading completion detection
- Console logging integration

**Usage**:
```jsx
const {
  loadingProgress,
  isLoading,
  loadedAssets,
  loadingComplete,
  updateProgress,
  setLoadingStatus,
  resetLoading
} = useLoadingState();
```

## Console Output

The system provides detailed console logging with emojis:

- 🚀 **Started loading**: Asset loading initiated
- 🖼️ **Loading texture/image**: Texture or image loading
- 🎨 **Loading SVG**: SVG file loading
- 🏗️ **Loading 3D model**: GLTF/GLB model loading
- ✅ **Asset loaded**: Successful asset loading
- ❌ **Asset failed**: Failed asset loading
- 📊 **Loading Progress**: Overall progress percentage
- 📈 **Assets loaded**: Current asset counts
- 🎉 **ALL ASSETS LOADED**: Complete loading notification
- 🎊 **LOADING COMPLETE**: Final completion message

## Integration in App.jsx

The loading system is integrated into the main App component:

1. **Loading State Hook**: Manages global loading state
2. **Loading Screen**: Displays visual progress
3. **Loading Manager**: Tracks Three.js asset loading
4. **API Data Loading**: Tracks external data fetching

## Edge Cases Handled

1. **No Assets**: If no assets are detected, loading completes after 1 second
2. **API Failures**: Graceful handling of API data fetching errors
3. **Empty Image Arrays**: Proper handling when no images are available
4. **Missing SVGs**: Fallback to default SVG URL when none provided

## Customization

### Styling the Loading Screen
Modify the inline styles in `LoadingScreen.jsx` to match your design:
- Colors and gradients
- Typography
- Layout and spacing
- Animation effects

### Adding New Asset Types
To track additional asset types, modify `LoadingManager.jsx`:
1. Add new loader override
2. Update asset counting logic
3. Add to console logging

### Custom Loading Logic
Extend `useLoadingState.js` to add:
- Custom progress calculations
- Additional loading states
- Integration with external loading systems

## Performance Considerations

- The system uses prototype overrides for loaders, which is efficient
- Console logging is comprehensive but can be reduced in production
- Loading screen renders conditionally to avoid unnecessary DOM updates
- Asset counting is optimized with minimal re-renders

## Troubleshooting

### Loading Never Completes
- Check if assets are actually being loaded
- Verify loader overrides are working
- Check console for error messages

### Progress Not Updating
- Ensure `updateProgress` callback is properly passed
- Verify asset loading is triggering the overrides
- Check for timing issues with asset loading

### Visual Issues
- Verify LoadingScreen component is receiving correct props
- Check CSS conflicts with loading screen styles
- Ensure z-index is appropriate for your layout 