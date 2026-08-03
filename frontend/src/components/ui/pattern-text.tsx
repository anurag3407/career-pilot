import React from 'react';
import { cn } from '@/lib/utils';

export function PatternText({
	text = 'Text',
	className,
	...props
}: Omit<React.ComponentProps<'p'>, 'children'> & { text: string }) {
	return (
		<span
			data-shadow={text}
			className={cn(
				'relative inline-block font-bold',
				'[text-shadow:0.02em_0.02em_0_--theme(--color-background)]',
				'after:absolute after:top-2 after:left-2 after:-z-1 after:content-[attr(data-shadow)]',
				'after:bg-size-[0.05em_0.05em] after:bg-clip-text after:text-transparent after:text-shadow-none',
				'after:bg-[linear-gradient(45deg,transparent_45%,--theme(--color-foreground)_45%,--theme(--color-foreground)_55%,transparent_0)]',
				'after:animate-shadanim',
				className,
			)}
			{...props}
		>
			{text}
		</span>
	);
}
