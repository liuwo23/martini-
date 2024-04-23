import terrainVert from './TerrainShader/terrain.vertex'
import terrainFrag from './TerrainShader/terrain.fragement'
import terrainNormalVertex from './normal/terrain-normal.vertex';
import terrainNormalFrag from './normal/terrain-normal.frag';

export const shaders = {
    terrain: {
        vertex: terrainVert,
        fragment: terrainFrag,
    },
    terrainnormal: {
        vertex: terrainNormalVertex,
        fragment: terrainNormalFrag,
    }
};