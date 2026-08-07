/**
 * A real page navigation (landing -> /editor) destroys in-memory JS state and
 * invalidates any blob: URLs, so the loaded photo can't just be handed off
 * via a variable or URL. IndexedDB is the one browser storage that natively
 * stores Blob/File objects (unlike sessionStorage, which is string-only and
 * far too small for a full-size photo), so it's used here as a one-shot
 * handoff: the landing page writes the resolved image, the editor page reads
 * and immediately deletes it.
 */

const DB_NAME = 'cinematic-photo-handoff';
const STORE_NAME = 'pending-image';
const KEY = 'current';

interface PendingImage {
	blob: Blob;
	fileName: string;
}

function openDb(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = () => {
			request.result.createObjectStore(STORE_NAME);
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error ?? new Error('Could not open IndexedDB.'));
	});
}

export async function savePendingImage(blob: Blob, fileName: string): Promise<void> {
	const db = await openDb();
	await new Promise<void>((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, 'readwrite');
		tx.objectStore(STORE_NAME).put({ blob, fileName } satisfies PendingImage, KEY);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? new Error('Could not save the image.'));
	});
	db.close();
}

export async function takePendingImage(): Promise<PendingImage | null> {
	const db = await openDb();
	const result = await new Promise<PendingImage | null>((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, 'readwrite');
		const store = tx.objectStore(STORE_NAME);
		const getRequest = store.get(KEY);
		getRequest.onsuccess = () => {
			store.delete(KEY);
		};
		tx.oncomplete = () => resolve((getRequest.result as PendingImage | undefined) ?? null);
		tx.onerror = () => reject(tx.error ?? new Error('Could not read the image.'));
	});
	db.close();
	return result;
}
