import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';

import state from '../store';

const Shirt = () => {
    const snap = useSnapshot(state);

    // Load the shirt model and materials
    const { nodes, materials } = useGLTF('/shirt_baked.glb');

    // Load textures for logo and full-shirt designs
    const logoTexture = useTexture(snap.logoDecal);
    const fullTexture = useTexture(snap.fullDecal);

    // Set anisotropy directly on the textures to improve quality
    logoTexture.anisotropy = 16;
    fullTexture.anisotropy = 16;

    // Update the shirt color dynamically based on the selected color
    useFrame((state, delta) => {
        easing.dampC(materials.lambert1.color, snap.color, 0.25, delta);
    });

    return (
        <group key={JSON.stringify(snap)}>
            <mesh
                castShadow={false}
                geometry={nodes.T_Shirt_male.geometry}
                material={materials.lambert1}
                dispose={null}
            >
                {/* Apply the full texture if the state indicates it's active */}
                {snap.isFullTexture && (
                    <Decal
                        position={[0, 0, 0]}
                        rotation={[0, 0, 0]}
                        scale={1}
                        map={fullTexture}
                    />
                )}

                {/* Apply the logo texture if the state indicates it's active */}
                {snap.isLogoTexture && (
                    <Decal
                        position={[0, 0.04, 0.15]}
                        rotation={[0, 0, 0]}
                        scale={0.15}
                        map={logoTexture}
                        depthTest={false}
                        depthWrite={true}
                    />
                )}
            </mesh>
        </group>
    );
};

export default Shirt;
