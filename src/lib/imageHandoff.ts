/**
 * A real page navigation (landing -> /editor) destroys in-memory JS state and
 * invalidates any blob: URLs, so the loaded photo can't just be handed off
 * via a variable or URL. IndexedDB is the one browser storage that natively
 * stores Blob/File objects (unlike sessionStorage, which is string-only and
 * far too small for a full-size photo), so it's used here to persist the
 * editor's current photo: the landing page writes the initial photo, the
 * editor overwrites it on every replace, and the editor reads it back on
 * every load — including a page reload, so refreshing /editor resumes the
 * same photo instead of bouncing back to the homepage.
 */

const DB_NAME = 'cinematic-photo-handoff';
const STORE_NAME = 'pending-image';
const KEY = 'current';

interface StoredImage {
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

export async function saveCurrentImage(blob: Blob, fileName: string): Promise<void> {
	const db = await openDb();
	await new Promise<void>((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, 'readwrite');
		tx.objectStore(STORE_NAME).put({ blob, fileName } satisfies StoredImage, KEY);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? new Error('Could not save the image.'));
	});
	db.close();
}

export async function loadCurrentImage(): Promise<StoredImage | null> {
	const db = await openDb();
	const result = await new Promise<StoredImage | null>((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, 'readonly');
		const getRequest = tx.objectStore(STORE_NAME).get(KEY);
		tx.oncomplete = () => resolve((getRequest.result as StoredImage | undefined) ?? null);
		tx.onerror = () => reject(tx.error ?? new Error('Could not read the image.'));
	});
	db.close();
	return result;
}

export async function clearCurrentImage(): Promise<void> {
	const db = await openDb();
	await new Promise<void>((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, 'readwrite');
		tx.objectStore(STORE_NAME).delete(KEY);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? new Error('Could not clear the image.'));
	});
	db.close();
}
