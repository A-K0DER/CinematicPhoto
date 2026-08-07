/**
 * CR3 (Canon RAW 3) is an ISO-BMFF container, not a natively decodable image
 * format. Every CR3 embeds one or more full JPEG previews generated in-camera.
 * Rather than demosaicing raw sensor data, we scan the container for JPEG
 * SOI/EOI byte markers and use the largest embedded JPEG as the edit source.
 */

const SOI = [0xff, 0xd8];
const EOI = [0xff, 0xd9];

export function isRawContainerFile(file: File): boolean {
	return /\.cr3$/i.test(file.name);
}

function findJpegRanges(bytes: Uint8Array): Array<{ start: number; end: number }> {
	const ranges: Array<{ start: number; end: number }> = [];
	let i = 0;
	while (i < bytes.length - 1) {
		if (bytes[i] === SOI[0] && bytes[i + 1] === SOI[1]) {
			let j = i + 2;
			let eoi = -1;
			while (j < bytes.length - 1) {
				if (bytes[j] === EOI[0] && bytes[j + 1] === EOI[1]) {
					eoi = j + 2;
					break;
				}
				j++;
			}
			if (eoi !== -1) {
				ranges.push({ start: i, end: eoi });
				i = eoi;
				continue;
			}
		}
		i++;
	}
	return ranges;
}

export async function extractRawPreviewBlob(file: File): Promise<Blob> {
	const buffer = await file.arrayBuffer();
	const bytes = new Uint8Array(buffer);
	const ranges = findJpegRanges(bytes);
	if (ranges.length === 0) {
		throw new Error('Could not find a JPEG preview inside this CR3 file.');
	}
	const largest = ranges.reduce((best, r) => (r.end - r.start > best.end - best.start ? r : best));
	return new Blob([buffer.slice(largest.start, largest.end)], { type: 'image/jpeg' });
}
