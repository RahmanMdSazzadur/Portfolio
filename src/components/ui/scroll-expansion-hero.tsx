'use client';

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

export interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

export default function ScrollExpandMedia({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) {
  const [isMobileState, setIsMobileState] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Next.js App Router preserves scroll position for 1 frame during soft navigations.
  // We force safeScrollProgress to 0 until the component has mounted and scroll is reset.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    // Explicitly lock scroll to top before unlocking the framer-motion physics
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const safeScrollProgress = useTransform(scrollYProgress, (v) => isMounted ? v : 0);

  const mediaWidth = useTransform(safeScrollProgress, [0, 1], [300, isMobileState ? 950 : 1550]);
  const mediaHeight = useTransform(safeScrollProgress, [0, 1], [400, isMobileState ? 600 : 800]);
  const textTranslateX = useTransform(safeScrollProgress, [0, 1], [0, isMobileState ? 180 : 150]);
  const bgOpacity = useTransform(safeScrollProgress, [0, 1], [1, 0]);
  const overlayOpacity = useTransform(safeScrollProgress, [0, 1], [0.7, 0.2]);
  const contentOpacity = useTransform(safeScrollProgress, [0.45, 0.55], [0, 1]);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div
      ref={containerRef}
      className='transition-colors duration-700 ease-in-out relative h-[450dvh]'
    >
      <section className='sticky top-0 h-[100dvh] overflow-hidden flex flex-col items-center justify-start'>
        <div className='relative w-full flex flex-col items-center h-[100dvh]'>
          <motion.div
            className='absolute inset-0 z-0 h-full'
            style={{ opacity: bgOpacity }}
          >
            {bgImageSrc && (
              <Image
                src={bgImageSrc}
                alt='Background'
                fill
                className='w-screen h-screen object-cover object-center'
                priority
              />
            )}
            <div className='absolute inset-0 bg-black/80 backdrop-blur-[2px]' />
          </motion.div>

          <div className='container mx-auto flex flex-col items-center justify-start relative z-10'>
            <div className='flex flex-col items-center justify-center w-full h-[100dvh] relative'>
              <motion.div
                className='absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl'
                style={{
                  width: mediaWidth,
                  height: mediaHeight,
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                  boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.3)',
                }}
              >
                {mediaType === 'video' ? (
                  mediaSrc.includes('youtube.com') ? (
                    <div className='relative w-full h-full pointer-events-none'>
                      <iframe
                        width='100%'
                        height='100%'
                        src={
                          mediaSrc.includes('embed')
                            ? mediaSrc +
                              (mediaSrc.includes('?') ? '&' : '?') +
                              'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                            : mediaSrc.replace('watch?v=', 'embed/') +
                              '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=' +
                              mediaSrc.split('v=')[1]
                        }
                        className='w-full h-full rounded-xl'
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                      />
                      <div
                        className='absolute inset-0 z-10'
                        style={{ pointerEvents: 'none' }}
                      ></div>

                      <motion.div
                        className='absolute inset-0 bg-black/30 rounded-xl'
                        style={{ opacity: overlayOpacity }}
                      />
                    </div>
                  ) : (
                    <div className='relative w-full h-full pointer-events-none'>
                      <motion.div
                        className='absolute inset-0 bg-black/30 rounded-xl'
                        style={{ opacity: overlayOpacity }}
                      />
                    </div>
                  )
                ) : (
                  <div className='relative w-full h-full'>
                    {mediaSrc && (
                      <Image
                        src={mediaSrc}
                        alt={title || 'Media content'}
                        fill
                        className='w-full h-full object-cover rounded-[2rem] border border-white/10'
                      />
                    )}

                    <motion.div
                      className='absolute inset-0 bg-black/50 rounded-[2rem]'
                      style={{ opacity: overlayOpacity }}
                    />
                  </div>
                )}

                <div className='flex flex-col items-center text-center relative z-20 mt-4 transition-none'>
                  {date && (
                    <motion.p
                      className='text-xl md:text-2xl text-[#C1E8FF] font-bold tracking-widest uppercase'
                      style={{ x: useTransform(textTranslateX, (v) => -v + 'vw') }}
                    >
                      {date}
                    </motion.p>
                  )}
                  {scrollToExpand && (
                    <motion.p
                      className='text-white/50 font-medium text-center text-sm uppercase tracking-[0.2em] mt-2'
                      style={{ x: useTransform(textTranslateX, (v) => v + 'vw'), opacity: bgOpacity }}
                    >
                      {scrollToExpand}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              <div
                className={`flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col ${
                  textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                }`}
              >
                <motion.h2
                  className='text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter transition-none'
                  style={{ x: useTransform(textTranslateX, (v) => -v + 'vw') }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  className='text-3xl md:text-5xl lg:text-7xl font-bold text-center text-white/50 uppercase tracking-tighter transition-none'
                  style={{ x: useTransform(textTranslateX, (v) => v + 'vw') }}
                >
                  {restOfTitle}
                </motion.h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section below the sticky hero */}
      <motion.section
        className='flex flex-col w-full px-8 py-10 md:px-16 lg:py-20 max-w-5xl mx-auto relative z-20'
        style={{ opacity: contentOpacity, background: 'linear-gradient(180deg, transparent 0%, rgba(2, 16, 36, 0.95) 5%, rgba(2, 16, 36, 1) 15%)' }}
      >
        {children}
      </motion.section>
    </div>
  );
}
