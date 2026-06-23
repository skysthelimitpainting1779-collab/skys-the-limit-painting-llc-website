$env:OPENAI_BASE_URL = 'https://integrate.api.nvidia.com/v1'
$env:OPENAI_API_KEY = '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'
$env:OPENAI_MODEL = 'deepseek-ai/deepseek-v4-pro'

Write-Host "Running graphify using OpenAI-compatible Nvidia NIM free model endpoint (deepseek-ai/deepseek-v4-pro)..."
graphify . --backend openai --no-viz
