import io
import base64
import cv2
import numpy as np
import requests
import torch
import torch.nn as nn
import timm
from PIL import Image
from torchvision import transforms
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
import os

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
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

class ChatRequest(BaseModel):
    message: str


# ---------------------------------------------------------
# EFFICIENTNET-B2 MODEL SETUP & GRAD-CAM
# ---------------------------------------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_model():
    model = timm.create_model("efficientnet_b2", pretrained=False)
    num_features = model.classifier.in_features
    model.classifier = nn.Sequential(
        nn.Dropout(0.4),
        nn.Linear(num_features, 256),
        nn.ReLU(),
        nn.Dropout(0.2),
        nn.Linear(256, 2),
    )
    model.load_state_dict(torch.load("best_model.pth", map_location=device))
    model.to(device)
    model.eval()
    return model

model = load_model()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

def generate_gradcam(img_pil, tensor, target_class):
    activations = []
    gradients = []
    target_layer = model.conv_head

    def forward_hook(module, inp, out):
        activations.append(out)

    def backward_hook(module, grad_in, grad_out):
        gradients.append(grad_out[0])

    fh = target_layer.register_forward_hook(forward_hook)
    bh = target_layer.register_full_backward_hook(backward_hook)

    model.zero_grad()
    output = model(tensor)
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
    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        tensor = transform(img).unsqueeze(0).to(device)

        with torch.no_grad():
            probs = torch.softmax(model(tensor), dim=1)[0]

        classes = ["NORMAL", "PNEUMONIA"]
        pred_idx = probs.argmax().item()
        prediction = classes[pred_idx]

        normal_prob = round(probs[0].item() * 100, 1)
        pneumonia_prob = round(probs[1].item() * 100, 1)
        confidence = round(probs[pred_idx].item() * 100, 1)

        heatmap_b64, circled_b64 = generate_gradcam(
            img, tensor.clone().detach().requires_grad_(True), pred_idx
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat")
async def chat_with_assistant(request: ChatRequest):
    try:
        url = "https://api.groq.com/openai/v1/chat/completions"

        payload = {
            "model": GROQ_MODEL,
            "messages": [
                {"role": "system", "content": SYSTEM_INSTRUCTION},
                {"role": "user", "content": request.message}
            ]
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {GROQ_API_KEY}"
        }

        response = requests.post(url, json=payload, headers=headers, timeout=30)

        # Agar Groq API ki taraf se koi error aaye
        if response.status_code != 200:
            print(f"Groq API Error Response: {response.text}")
            raise HTTPException(status_code=response.status_code, detail=f"Groq API Error: {response.text}")

        res_data = response.json()

        # Safe extraction of text response
        try:
            ai_reply = res_data["choices"][0]["message"]["content"]
        except (KeyError, IndexError) as parsing_error:
            print(f"Parsing Error: {res_data}")
            raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(parsing_error)}")

        return {
            "status": "success",
            "reply": ai_reply
        }
    except Exception as e:
        print(f"Server Exception: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))