import React from 'react';
import Lottie from 'react-lottie';
import loader from '../lotties/water-loader.json';

const WaveLoader = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: loader,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (
        <div className="loader-container">
            <Lottie options={defaultOptions} />
        </div>
    )
}

export default WaveLoader;