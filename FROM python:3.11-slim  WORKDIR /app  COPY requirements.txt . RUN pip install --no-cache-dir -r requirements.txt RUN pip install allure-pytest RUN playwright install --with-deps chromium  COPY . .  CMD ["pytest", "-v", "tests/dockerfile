FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install allure-pytest
RUN playwright install --with-deps chromium

COPY . .

CMD ["pytest", "-v", "tests/", "--alluredir=allure-results"]
