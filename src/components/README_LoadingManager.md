# LoadingManager.jsx

A drop-in, headless asset loading tracker for React Three Fiber projects.

## Features
- Tracks all Three.js asset loading (textures, images, SVGs, GLTFs)
- Calls your callbacks with progress and asset counts
- No UI, no state, no dependencies—just drop it in and use your own UI if desired
- Safe to use in any project, no project-specific logic

## Usage

1. **Import and place inside your `<Canvas>` tree:**

```jsx
import LoadingManager from './components/LoadingManager.jsx';

<Canvas>
  <LoadingManager
    onProgress={(progress, assets) => {
      // progress: number (0-100)
      // assets: { textures, images, models, svgs, total }
      // Use this to update your own UI or state
      console.log('Progress:', progress, assets);
    }}
    onLoadComplete={() => {
      // Called when all assets are loaded
      console.log('All assets loaded!');
    }}
    onStart={() => {
      // (Optional) Called when loading starts
      console.log('Loading started!');
    }}
  />
  {/* ...your scene... */}
</Canvas>
```

2. **Props**

| Prop            | Type       | Description                                      |
|-----------------|------------|--------------------------------------------------|
| onProgress      | function   | (progress, assets) => void. Called on progress.   |
| onLoadComplete  | function   | () => void. Called when all assets are loaded.    |
| onStart         | function   | () => void. (Optional) Called when loading starts.|

- `progress`: number (0-100)
- `assets`: `{ textures, images, models, svgs, total }`

3. **No UI is included**
- Use your own loading screen, spinner, or state as you wish.
- This utility is purely for tracking and reporting loading progress.

## Example

```jsx
import LoadingManager from './components/LoadingManager.jsx';

function MyApp() {
  const [progress, setProgress] = useState(0);
  const [assets, setAssets] = useState({});
  const [done, setDone] = useState(false);

  return (
    <Canvas>
      <LoadingManager
        onProgress={(p, a) => { setProgress(p); setAssets(a); }}
        onLoadComplete={() => setDone(true)}
      />
      {/* ...your scene... */}
      {!done && <div>Loading: {progress.toFixed(0)}%</div>}
    </Canvas>
  );
}
```

## Notes
- Place only one `<LoadingManager />` in your app.
- It is safe to use with Suspense, StrictMode, and any asset loading pattern.
- No cleanup is needed; it will not interfere with other Three.js code.

## Advanced
- You can use the `onStart` prop to trigger UI changes when loading begins.
- Asset counts are provided for advanced progress bars or analytics.

---

**Drop it in, wire up your own UI, and you're done!** 