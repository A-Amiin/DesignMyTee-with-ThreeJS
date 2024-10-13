// import { useRef } from 'react';
// import { AccumulativeShadows, RandomizedLight } from '@react-three/drei';

// const Backdrop = () => {
//     const shadows = useRef();

//     return (
//         <AccumulativeShadows
//             ref={shadows}
//             temporal
//             frames={60}
//             alphaTest={0.85}
//             scae={10}
//             rotation={[Math.PI / 2, 0, 0]}
//             position={[0, 0, -0.14]}
//         >
//             <RandomizedLight
//                 amount={4}
//                 radius={9}
//                 intensity={0.55}
//                 ambient={0.25}
//                 position={[5, 5, -10]}
//             />
//             <RandomizedLight
//                 amount={4}
//                 radius={5}
//                 intensity={0.25}
//                 ambient={0.55}
//                 position={[-5, 5, -9]}
//             />
//         </AccumulativeShadows>
//     )
// }

// export default Backdrop
import { useRef } from 'react';
import { AccumulativeShadows, RandomizedLight } from '@react-three/drei';

const Backdrop = () => {
    const shadows = useRef();

    return (
        <AccumulativeShadows
            ref={shadows}
            temporal
            frames={100}
            alphaTest={0.9}
            scale={5} // Reduced scale to focus the effect tightly around the T-shirt
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 0, -0.05]} // Moved slightly closer behind the T-shirt
        >
            <RandomizedLight
                amount={2} // Lowered to minimize excessive light scattering
                radius={2}  // Tightened radius to create a more focused effect
                intensity={0.6} // Adjusted intensity for a stronger highlight on the shirt
                ambient={0.2} // Reduced ambient light to focus more on the shirt
                position={[2, 2, -2]} // Positioned light closer to the shirt
            />
            <RandomizedLight
                amount={1} // Single secondary light to avoid too much light spread
                radius={1.5} // Narrow radius for the second light
                intensity={0.35} // Softer secondary light
                ambient={0.25} // Balanced ambient to avoid washing out shadows
                position={[-2, 2, -3]} // Positioned slightly offset for a soft shadow
            />
        </AccumulativeShadows>
    );
}

export default Backdrop;