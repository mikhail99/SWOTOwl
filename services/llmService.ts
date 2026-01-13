/**
 * Unified LLM Interface for SWOTOwl
 * Abstracts between WebGPU (browser), Gemini (cloud), and Ollama (local backend)
 */

export type LLMProvider = 'webgpu' | 'gemini' | 'ollama';

export interface GenerateOptions {
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
}

export interface LLMResult {
    text: string;
    usage?: { inputTokens: number; outputTokens: number };
}

// Callback for streaming tokens
export type StreamCallback = (chunk: string, state: 'thinking' | 'answering') => void;

// Message format for chat
export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

/**
 * Request tracking for concurrent operations
 */
interface PendingRequest {
    id: string;
    resolve: (value: string) => void;
    reject: (error: Error) => void;
    streamCallback?: StreamCallback;
}

/**
 * LLM Service - manages communication with the WebGPU worker
 */
class LLMService {
    private worker: Worker | null = null;
    private provider: LLMProvider = 'webgpu';
    private isReady = false;
    private isLoading = false;
    private pendingRequests = new Map<string, PendingRequest>();
    private loadingCallback: ((progress: any) => void) | null = null;

    async init(onProgress?: (progress: any) => void): Promise<void> {
        if (this.worker) return;

        this.loadingCallback = onProgress || null;
        this.worker = new Worker(
            new URL('./llm.worker.ts', import.meta.url),
            { type: 'module' }
        );

        this.worker.onmessage = (e) => this.handleMessage(e.data);
        this.worker.onerror = (e) => console.error('Worker error:', e);

        // Check WebGPU support
        this.worker.postMessage({ type: 'check' });
    }

    private handleMessage(data: any) {
        switch (data.status) {
            case 'loading':
                this.isLoading = true;
                this.loadingCallback?.(data);
                break;
            case 'ready':
                this.isReady = true;
                this.isLoading = false;
                this.loadingCallback?.({ status: 'ready' });
                break;
            case 'start':
                // Generation started
                break;
            case 'update':
                // Streaming token - route to specific request
                const updateRequest = this.pendingRequests.get(data.requestId);
                updateRequest?.streamCallback?.(data.output, data.state);
                break;
            case 'complete':
                // Route completion to specific request
                const completeRequest = this.pendingRequests.get(data.requestId);
                if (completeRequest) {
                    completeRequest.resolve(data.output);
                    this.pendingRequests.delete(data.requestId);
                }
                break;
            case 'error':
                // Route error to specific request
                console.error('LLM Error:', data.error);
                const errorRequest = this.pendingRequests.get(data.requestId);
                if (errorRequest) {
                    errorRequest.reject(new Error(data.error || 'LLM request failed'));
                    this.pendingRequests.delete(data.requestId);
                }
                break;
            case 'progress':
                // Model download progress
                this.loadingCallback?.(data);
                break;
        }
    }

    async loadModel(modelId: string = 'onnx-community/Qwen3-0.6B-ONNX'): Promise<void> {
        if (!this.worker) await this.init();
        return new Promise((resolve) => {
            const originalCallback = this.loadingCallback;
            this.loadingCallback = (data) => {
                originalCallback?.(data);
                if (data.status === 'ready') resolve();
            };
            this.worker!.postMessage({ type: 'load', data: { model_id: modelId } });
        });
    }

    async generate(prompt: string, options: GenerateOptions = {}): Promise<string> {
        if (!this.worker || !this.isReady) {
            throw new Error('LLM not initialized. Call loadModel() first.');
        }

        const messages: ChatMessage[] = [
            { role: 'system', content: options.systemPrompt || 'You are a helpful research assistant. Keep your answers concise and factual.' },
            { role: 'user', content: prompt }
        ];

        const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        return new Promise((resolve, reject) => {
            this.pendingRequests.set(requestId, { id: requestId, resolve, reject });
            this.worker!.postMessage({
                type: 'generate',
                data: { messages, requestId }
            });
        });
    }

    async stream(prompt: string, onChunk: StreamCallback, options: GenerateOptions = {}): Promise<string> {
        if (!this.worker || !this.isReady) {
            throw new Error('LLM not initialized. Call loadModel() first.');
        }

        const messages: ChatMessage[] = [
            { role: 'system', content: options.systemPrompt || 'You are a helpful research assistant. Keep your answers concise and factual.' },
            { role: 'user', content: prompt }
        ];

        const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        return new Promise((resolve, reject) => {
            this.pendingRequests.set(requestId, {
                id: requestId,
                resolve,
                reject,
                streamCallback: onChunk
            });
            this.worker!.postMessage({
                type: 'generate',
                data: { messages, requestId }
            });
        });
    }

    interrupt(): void {
        // Cancel all pending requests
        for (const request of this.pendingRequests.values()) {
            request.reject(new Error('Request interrupted'));
        }
        this.pendingRequests.clear();
        this.worker?.postMessage({ type: 'interrupt' });
    }

    reset(): void {
        // Cancel all pending requests
        for (const request of this.pendingRequests.values()) {
            request.reject(new Error('Service reset'));
        }
        this.pendingRequests.clear();
        this.worker?.postMessage({ type: 'reset' });
    }

    getStatus(): { ready: boolean; loading: boolean; provider: LLMProvider } {
        return { ready: this.isReady, loading: this.isLoading, provider: this.provider };
    }
}

// Singleton export
export const llmService = new LLMService();
