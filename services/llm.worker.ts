import {
    AutoTokenizer,
    AutoModelForCausalLM,
    TextStreamer,
    InterruptableStoppingCriteria,
} from "@huggingface/transformers";

/**
 * Helper function to perform feature detection for WebGPU
 */
async function check() {
    try {
        if (!(navigator as any).gpu) {
            throw new Error("WebGPU is not supported in this browser.");
        }
        const adapter = await (navigator as any).gpu.requestAdapter();
        if (!adapter) {
            throw new Error("WebGPU is not supported (no adapter found)");
        }
    } catch (e: any) {
        self.postMessage({
            status: "error",
            error: e.toString(),
        });
    }
}

/**
 * This class uses the Singleton pattern to enable lazy-loading of the pipeline
 */
class TextGenerationPipeline {
    static model_id = "onnx-community/Qwen3-0.6B-ONNX";
    static tokenizer: any = null;
    static model: any = null;

    static async getInstance(progress_callback: any = null, model_id: string | null = null) {
        // If a new model_id is requested and different from current, reset
        if (model_id && model_id !== this.model_id) {
            this.model_id = model_id;
            this.tokenizer = null;
            this.model = null; // Basic disposal relying on GC
        }

        this.tokenizer ??= await AutoTokenizer.from_pretrained(this.model_id, {
            progress_callback,
        });

        this.model ??= await AutoModelForCausalLM.from_pretrained(this.model_id, {
            dtype: "q4f16",
            device: "webgpu",
            progress_callback,
        }).catch(async (gpuError) => {
            console.warn("WebGPU failed, falling back to CPU:", gpuError);
            // Fallback to CPU if WebGPU fails
            return await AutoModelForCausalLM.from_pretrained(this.model_id, {
                dtype: "q4f16",
                device: "cpu",
                progress_callback,
            });
        });

        return [this.tokenizer, this.model];
    }
}

const stopping_criteria = new InterruptableStoppingCriteria();

async function generate({ messages, reasonEnabled, requestId }: { messages: any[], reasonEnabled: boolean, requestId: string }) {
    // Retrieve the text-generation pipeline.
    const [tokenizer, model] = await TextGenerationPipeline.getInstance();

    const inputs = tokenizer.apply_chat_template(messages, {
        add_generation_prompt: true,
        return_dict: true,
        enable_thinking: reasonEnabled,
    });

    let state = "answering"; // 'thinking' or 'answering'
    let startTime: number;
    let numTokens = 0;
    let tps: number | undefined;

    // TPS calculation
    const token_callback_function = () => {
        startTime ??= performance.now();
        if (numTokens++ > 0) {
            tps = (numTokens / (performance.now() - startTime)) * 1000;
        }
    };

    const callback_function = (output: string) => {
        self.postMessage({
            status: "update",
            output,
            tps,
            numTokens,
            state,
            requestId: requestId,
        });
    };

    const streamer = new TextStreamer(tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function,
        token_callback_function,
    });

    // Tell the main thread we are starting
    self.postMessage({ status: "start", requestId: requestId });

    let sequences;
    try {
        const result = await model.generate({
            ...inputs,

            // Sampling
            do_sample: true,
            top_k: 20,
            temperature: reasonEnabled ? 0.6 : 0.7,

            max_new_tokens: 4096,
            streamer,
            stopping_criteria,
            return_dict_in_generate: true,
        });
        sequences = result.sequences;
    } catch (error: any) {
        // Provide better error messages for common issues
        let errorMessage = error.toString();

        // Handle specific error codes
        if (errorMessage.includes("1148195608")) {
            errorMessage = "GPU memory error: Model may be too large for your system's GPU memory. The system will try to fall back to CPU processing.";
        } else if (errorMessage.includes("WebGPU")) {
            errorMessage = "WebGPU error: GPU acceleration failed. Falling back to CPU processing, which will be slower.";
        } else if (errorMessage.includes("OutOfMemory")) {
            errorMessage = "Out of memory: The model is too large for your system's available memory. Try using the smaller model.";
        } else if (errorMessage.includes("shader")) {
            errorMessage = "Shader compilation error: GPU shaders failed to compile. Falling back to CPU processing.";
        }

        self.postMessage({
            status: "error",
            error: `Model execution failed: ${errorMessage}`,
            requestId: requestId,
        });
        return;
    }

    const decoded = tokenizer.batch_decode(sequences, {
        skip_special_tokens: true,
    });

    // Send the output back to the main thread
    self.postMessage({
        status: "complete",
        output: decoded[0], // batch_decode returns array
        requestId: requestId,
    });
}

async function load(model_id: string) {
    self.postMessage({
        status: "loading",
        data: `Loading model ${model_id}...`,
    });

    try {
        // Load the pipeline and save it for future use.
        // We pass the model_id to getInstance to potentially switch models
        await TextGenerationPipeline.getInstance((x: any) => {
            // We also add a progress callback to the pipeline so that we can
            // track model loading.
            self.postMessage(x);
        }, model_id);

        self.postMessage({
            status: "loading",
            data: "Compiling shaders and warming up model...",
        });

        // Run model with dummy input to compile shaders
        const [tokenizer, model] = await TextGenerationPipeline.getInstance();
        const inputs = tokenizer("a");
        await model.generate({ ...inputs, max_new_tokens: 1 });
        self.postMessage({ status: "ready" });
    } catch (e: any) {
        let errorMessage = e.toString();

        // Handle specific error codes and provide helpful messages
        if (errorMessage.includes("1148195608")) {
            errorMessage = "GPU memory error during model initialization: Model may be too large for your GPU memory.";
        } else if (errorMessage.includes("WebGPU")) {
            errorMessage = "WebGPU not supported: GPU acceleration not available. The model will run on CPU (slower).";
        } else if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
            errorMessage = "Network error loading model: Check your internet connection and try again.";
        } else if (errorMessage.includes("OutOfMemory")) {
            errorMessage = "Insufficient memory: Try using the smaller model or closing other applications.";
        }

        self.postMessage({
            status: "error",
            error: `Model loading failed: ${errorMessage}`,
        });
    }
}

// Listen for messages from the main thread
self.addEventListener("message", async (e) => {
    const { type, data } = e.data;

    switch (type) {
        case "check":
            check();
            break;

        case "load":
            await load(data.model_id);
            break;

        case "generate":
            stopping_criteria.reset();
            const messages = data.messages || [
                { role: "system", content: "You are a helpful research assistant. Keep your answers concise." },
                { role: "user", content: data.text || data }
            ];

            generate({ messages, reasonEnabled: false, requestId: data.requestId });
            break;

        case "interrupt":
            stopping_criteria.interrupt();
            break;

        case "reset":
            stopping_criteria.reset();
            break;
    }
});
