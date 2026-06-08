import '@testing-library/jest-dom';

import { TextDecoder, TextEncoder } from 'util';

if (!global.TextEncoder) {
	global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
	global.TextDecoder = TextDecoder;
}

if (!global.fetch) {
	global.fetch = jest.fn();
}

if (typeof window !== 'undefined') {
	window.scrollTo = jest.fn();
}
