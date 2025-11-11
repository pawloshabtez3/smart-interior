# 3D Room Models

This directory contains placeholder GLB models for the Smart Interior Design Previewer application.

## Models

- `living-room.glb` - Living room scene with furniture
- `bedroom.glb` - Bedroom scene with furniture
- `office.glb` - Office scene with furniture

## Model Structure

Each model includes:

### Geometry
- **Floor**: Horizontal plane at y=0
- **Walls**: Four walls forming a room (back, right, front, left)
- **Ceiling**: Horizontal plane at y=3
- **Furniture pieces**: Two simple box geometries positioned in the room

### Named Materials

All models include the following named materials that can be dynamically updated by the application:

1. **FloorMaterial** - Applied to the floor mesh
   - Default: Tan/beige color (0.8, 0.7, 0.6)
   - High roughness (0.8), no metalness

2. **WallMaterial** - Applied to wall meshes
   - Default: Off-white color (0.9, 0.9, 0.85)
   - High roughness (0.9), no metalness

3. **CeilingMaterial** - Applied to ceiling mesh
   - Default: White color (0.95, 0.95, 0.95)
   - High roughness (0.9), no metalness

4. **FurnitureMaterial** - Applied to primary furniture pieces
   - Default: Brown color (0.6, 0.4, 0.3)
   - Medium roughness (0.6), low metalness (0.1)

5. **AccentMaterial** - Applied to secondary furniture/decor
   - Default: Light brown color (0.7, 0.5, 0.4)
   - Medium roughness (0.5), low metalness (0.2)

## Technical Details

- **Format**: GLB (Binary glTF 2.0)
- **File size**: ~5.5 KB each (optimized for web)
- **Polygon count**: Minimal (optimized for performance)
- **Textures**: None (using vertex colors and PBR materials)
- **Animations**: None

## Generation

These models were generated programmatically using the script at `scripts/generate-models.js`.

To regenerate the models:
```bash
node scripts/generate-models.js
```

To verify the models:
```bash
node scripts/verify-models.js
```

## Usage in Application

The models are loaded by the `RoomCanvas` component using React Three Fiber's `useGLTF` hook:

```typescript
const gltf = useGLTF(`/models/${roomType}.glb`);
```

The application dynamically updates material properties based on:
- **Style preset** (modern, boho, minimalist) - affects roughness and metalness
- **Color theme** (warm, cool, neutral) - affects base colors
- **Lighting mood** (morning, evening, night) - affects scene lighting

## Future Improvements

For production use, consider:
- Adding more detailed geometry and furniture pieces
- Including UV-mapped textures for realistic materials
- Adding normal maps for surface detail
- Optimizing with Draco compression
- Creating room-specific furniture layouts
- Adding decorative elements (plants, artwork, etc.)

## Optimization

Current models are already optimized for web use:
- Minimal polygon count
- No textures (reduces file size and load time)
- Efficient GLB binary format
- Named materials for easy dynamic updates

For further optimization, you can use:
```bash
npm install -g gltf-pipeline
gltf-pipeline -i model.glb -o model-optimized.glb -d
```
