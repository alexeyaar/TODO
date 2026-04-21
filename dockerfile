FROM python:3.11-slim

WORKDIR /app

# Устанавливаем системные зависимости для Playwright
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install allure-pytest

# Устанавливаем Playwright и браузеры
RUN playwright install chromium
RUN playwright install-deps chromium

COPY . .

CMD ["pytest", "-v", "tests/", "--alluredir=allure-results"]
