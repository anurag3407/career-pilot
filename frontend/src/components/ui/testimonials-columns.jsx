"use client";
import React from "react";
import { motion } from "motion/react";

export const TestimonialsColumn = (props) => {
    return (
        <div className={props.className}>
            <motion.div
                animate={{
                    translateY: "-50%",
                }}
                transition={{
                    duration: props.duration || 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6 bg-transparent"
            >
                {[
                    ...new Array(2).fill(0).map((_, index) => (
                        <React.Fragment key={`col-${index}`}>
                            {props.testimonials.map(({ text, image, name, role }, i) => (
                                <div className="p-8 rounded-[2rem] border border-border shadow-2xl shadow-primary/5 max-w-xs w-full bg-card/50 backdrop-blur-sm group/card hover:border-primary/30 transition-all duration-300" key={`${index}-${i}-${name}`}>
                                     <div className="text-foreground/80 text-base leading-relaxed font-medium italic">"{text}"</div>
                                     <div className="flex items-center gap-4 mt-8">
                                         <div className="relative">
                                             <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                             <img
                                                 width={48}
                                                 height={48}
                                                 src={image}
                                                 alt={name}
                                                 className="h-12 w-12 rounded-full object-cover border-2 border-border relative z-10"
                                             />
                                         </div>
                                         <div className="flex flex-col">
                                             <div className="font-black tracking-tight leading-tight text-foreground text-lg">{name}</div>
                                             <div className="leading-tight text-muted-foreground tracking-tight text-sm font-bold uppercase">{role}</div>
                                         </div>
                                     </div>
                                 </div>
                            ))}
                        </React.Fragment>
                    )),
                ]}
            </motion.div>
        </div>
    );
};

export default TestimonialsColumn;