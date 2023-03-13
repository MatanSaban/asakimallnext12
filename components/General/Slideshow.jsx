import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Slideshow.module.scss";

const Slideshow = ({ images, intervalTime }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [sliderIndex, setSliderIndex] = useState(0);
    const [sliderMaxIndex, setSliderMaxIndex] = useState(
        Math.ceil(images.length / 4) - 1
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(
                (prevIndex) => (prevIndex + 1) % images.length
            );
        }, intervalTime);
        return () => clearInterval(interval);
    }, [images.length, intervalTime]);

    const prevSlide = () => {
        setCurrentImageIndex(
            (prevIndex) => (prevIndex + images.length - 1) % images.length
        );
    };

    const nextSlide = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const selectSlide = (index) => {
        setCurrentImageIndex(index);
    };

    const prevSlider = () => {
        setSliderIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const nextSlider = () => {
        setSliderIndex((prevIndex) => Math.min(prevIndex + 1, sliderMaxIndex));
    };

    return (
        <div className={styles.slideshow}>
            <div className={styles.bigImageWrapper}>
                <button className={`${styles.arrow} ${styles.left}`} onClick={prevSlide}>&lt;</button>
                <div className={styles.bigImage}>
                    <Image
                        src={images[currentImageIndex]}
                        alt={`Slide ${currentImageIndex + 1}`}
						width={1080}
						height={1080}
                    />
                </div>
                <button className={`${styles.arrow} ${styles.right}`} onClick={nextSlide}>&gt;</button>
            </div>
			<div className={styles.slider}>
                <div className={styles.sliderImages}>
                    {images.map((image, index) => (
                            <div className={styles.sliderImageWrapper} key={index} onClick={() => selectSlide(sliderIndex * 4 + index) } >
                                <Image src={image} alt={`Slide ${sliderIndex * 4 + index + 1}`} width={80} height={80} />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Slideshow;
