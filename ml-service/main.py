import os
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

import io
import base64
import logging
import gc
import threading
import torch
import torch.nn as nn
import timm
import cv2
import numpy as np
import requests
from PIL import Image
from torchvision import transforms
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from config import GROQ_API_KEY

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="PneumoFusion API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# GROQ API CONFIGURATION
# ---------------------------------------------------------
GROQ_MODEL = os.environ.get("GROQ_MODEL", "openai/gpt-oss-120b")

SYSTEM_INSTRUCTION = """
You are PneumoFusion Assistant, an expert AI medical pulmonology and clinical assistant integrated into the PneumoFusion chest X-ray screening platform.

Your goal is to assist users, students, and patients with accurate, professional, and empathetic medical guidance on a broad range of topics, including:
- Pneumonia symptoms, diagnosis, and treatment
- Chest X-ray findings and confidence score interpretation
- Respiratory health, lung fitness, and breathing exercises
- Diet and nutrition recommendations for recovery
- General fitness and wellness guidance
- Medications, procedures, and when to seek emergency care

Tone: Warm, clear, professional, and reassuring. Use simple language where possible.

CRITICAL FORMATTING & LENGTH RULE:
- Keep your answers short, concise, and straight to the point (maximum 3 to 4 sentences unless a detailed breakdown is specifically requested). Avoid overly long paragraphs.

IMPORTANT SAFETY RULES:
- Always include a brief disclaimer that you are an AI assistant and not a substitute for professional medical advice.
- If a user describes emergency symptoms (severe shortness of breath, chest pain, cyanosis, confusion), immediately advise them to seek emergency medical care.
- Never diagnose; instead explain possibilities and recommend consulting a physician for confirmation.
"""

SYSTEM_PROMPT = """
You are the PneumoFusion Assistant, an AI assistant integrated into the PneumoFusion chest X-ray screening platform.

PneumoFusion is an AI chest X-ray screening tool — it is NOT a medical diagnosis. It uses an EfficientNet-B2 model (~8 million parameters) trained to classify chest X-rays into two categories: NORMAL or PNEUMONIA. The model also generates a Grad-CAM heatmap (from the conv_head layer) and up to two red region circles highlighting the areas it focused on most.

CRITICAL SAFETY RULE:
- Always remind the user that PneumoFusion is an AI screening tool, not a substitute for a qualified doctor's evaluation.
- If a user reports breathing trouble, chest pain, high fever, or low oxygen levels, advise them to seek urgent medical care immediately and consult a qualified doctor.
- Never provide a definitive diagnosis; explain possibilities only and recommend consulting a physician for confirmation.
"""

from typing import Optional

class ChatRequest(BaseModel):
    message: str
    prediction: Optional[str] = None
    confidence: Optional[float] = None
    normal_prob: Optional[float] = None
    pneumonia_prob: Optional[float] = None


# ---------------------------------------------------------
# EFFICIENTNET-B2 MODEL SETUP & GRAD-CAM
# ---------------------------------------------------------
device = torch.device("cpu")

MODEL_PATH = "best_model.pth"
DRIVE_FILE_ID = "1jn6n-yIH9_uF8n73SruMZx1Boffa-5qg"


def ensure_model():
    """Download best_model.pth from Google Drive if it is not present locally."""
    if os.path.exists(MODEL_PATH):
        logger.info("Model file found locally: %s", MODEL_PATH)
        return

    logger.info("Downloading model from Google Drive...")
    try:
        import gdown
        gdown.download(id=DRIVE_FILE_ID, output=str(MODEL_PATH), quiet=False)
        gc.collect()
    except Exception as exc:
        logger.error("Failed to download model: %s", exc)
        raise RuntimeError(f"Failed to download model: {exc}") from exc

    if not os.path.exists(MODEL_PATH):
        raise RuntimeError("Model file missing after download attempt")

    logger.info("Model downloaded successfully: %s", MODEL_PATH)


def load_model():
    with torch.no_grad():
        m = timm.create_model("efficientnet_b2", pretrained=False)
        num_features = m.classifier.in_features
        m.classifier = nn.Sequential(
            nn.Dropout(0.4),
            nn.Linear(num_features, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, 2),
        )
        state_dict = torch.load(MODEL_PATH, map_location="cpu")
        m.load_state_dict(state_dict)
        m.eval()
        del state_dict
        gc.collect()
        return m


model_ready = False
model_lock = threading.Lock()
model_container = {}


def model_initializer():
    """Initialize model in a background thread and set model_ready flag."""
    global model_ready
    try:
        ensure_model()
        loaded = load_model()
        with model_lock:
            model_container["model"] = loaded
            model_ready = True
    except Exception as exc:
        logger.error("Model initialization failed: %s", exc)
        with model_lock:
            model_ready = False


def get_model():
    """Return initialized model safely or raise HTTPException if not ready."""
    with model_lock:
        m = model_container.get("model")
    if not model_ready or m is None:
        raise HTTPException(status_code=503, detail="Model not ready yet")
    return m


def start_model_thread():
    """Start model initialization in background so Uvicorn binds port immediately."""
    t = threading.Thread(target=model_initializer, daemon=True)
    t.start()


start_model_thread()


@app.get("/")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "ok", "model_ready": model_ready}


transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])


def generate_gradcam(m, img_pil, tensor, target_class):
    activations = []
    gradients = []
    target_layer = m.conv_head

    def forward_hook(module, inp, out):
        activations.append(out)

    def backward_hook(module, grad_in, grad_out):
        gradients.append(grad_out[0])

    fh = target_layer.register_forward_hook(forward_hook)
    bh = target_layer.register_full_backward_hook(backward_hook)

    m.zero_grad()
    output = m(tensor)
    score = output[0, target_class]
    score.backward()

    fh.remove()
    bh.remove()

    grads = gradients[0].cpu().data.numpy()[0]
    acts = activations[0].cpu().data.numpy()[0]

    weights = np.mean(grads, axis=(1, 2))
    cam = np.zeros(acts.shape[1:], dtype=np.float32)
    for i, w in enumerate(weights):
        cam += w * acts[i]

    cam = np.maximum(cam, 0)
    if cam.max() > 0:
        cam = cam / cam.max()

    orig_np = np.array(img_pil.resize((224, 224)))
    cam_resized = cv2.resize(cam, (224, 224))

    heatmap = cv2.applyColorMap(np.uint8(255 * cam_resized), cv2.COLORMAP_JET)
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
    heatmap_overlay = np.uint8(0.6 * orig_np + 0.4 * heatmap)

    circled_img = orig_np.copy()
    mask = (cam_resized > 0.65).astype(np.uint8) * 255
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    valid_contours = []
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area >= 150:
            valid_contours.append((cnt, area))

    valid_contours.sort(key=lambda x: x[1], reverse=True)

    drawn_count = 0
    for cnt, area in valid_contours:
        if drawn_count >= 2:
            break
        (x, y), radius = cv2.minEnclosingCircle(cnt)
        center = (int(x), int(y))
        radius = int(radius) + 10
        cv2.circle(circled_img, center, radius, (255, 60, 60), 3)
        drawn_count += 1

    def to_base64(arr):
        pil_out = Image.fromarray(arr)
        buf = io.BytesIO()
        pil_out.save(buf, format="PNG")
        return base64.b64encode(buf.getvalue()).decode("utf-8")

    return to_base64(heatmap_overlay), to_base64(circled_img)


# ---------------------------------------------------------
# API ENDPOINTS
# ---------------------------------------------------------

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    m = get_model()
    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="No file uploaded")
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        tensor = transform(img).unsqueeze(0).to(device)

        with torch.no_grad():
            probs = torch.softmax(m(tensor), dim=1)[0]

        classes = ["NORMAL", "PNEUMONIA"]
        pred_idx = probs.argmax().item()
        prediction = classes[pred_idx]

        normal_prob = round(probs[0].item() * 100, 1)
        pneumonia_prob = round(probs[1].item() * 100, 1)
        confidence = round(probs[pred_idx].item() * 100, 1)

        heatmap_b64, circled_b64 = generate_gradcam(
            m, img, tensor.clone().detach().requires_grad_(True), pred_idx
        )

        return {
            "status": "success",
            "prediction": prediction,
            "confidence": confidence,
            "normal_prob": normal_prob,
            "pneumonia_prob": pneumonia_prob,
            "heatmap_image_base64": heatmap_b64,
            "circled_image_base64": circled_b64,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error during /predict handling")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.post("/chat")
async def chat_with_assistant(request: ChatRequest):
    try:
        url = "https://api.groq.com/openai/v1/chat/completions"

        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "system", "content": SYSTEM_INSTRUCTION},
        ]

        if request.prediction:
            context = f"\nCurrent Scan Context: Prediction={request.prediction}, Confidence={request.confidence}%, NormalProb={request.normal_prob}%, PneumoniaProb={request.pneumonia_prob}%"
            messages[0]["content"] += context

        messages.append({"role": "user", "content": request.message})

        payload = {
            "model": GROQ_MODEL,
            "messages": messages,
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {GROQ_API_KEY}",
        }

        response = requests.post(url, json=payload, headers=headers, timeout=30)

        if response.status_code != 200:
            logger.error("Groq API Error Response: %s", response.text)
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Groq API Error: {response.text}",
            )

        res_data = response.json()

        try:
            ai_reply = res_data["choices"][0]["message"]["content"]
        except (KeyError, IndexError) as parsing_error:
            logger.error("Parsing Error: %s", res_data)
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse AI response: {str(parsing_error)}",
            )

        return {
            "status": "success",
            "reply": ai_reply,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Server Exception in /chat")
        raise HTTPException(status_code=500, detail=str(e))