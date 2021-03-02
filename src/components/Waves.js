import React from 'react';
import Lottie from 'react-lottie';
import twowaves from '../lotties/blue-waves.json';

function Waves() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: twowaves,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    };

    return <Lottie options={defaultOptions} />
}

export default Waves;
