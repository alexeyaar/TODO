import pytest
from playwright.sync_api import sync_playwright, Page

BASE_URL = "http://localhost:3000"


@pytest.fixture(scope="session")
def api_base_url():
    return f"{BASE_URL}/api"


@pytest.fixture(scope="function")
def api_client(api_base_url):
    import requests
    session = requests.Session()
    yield session
    session.close()


@pytest.fixture(scope="function")
def browser_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # headless=False — если хочешь видеть браузер
        context = browser.new_context()
        page = context.new_page()
        yield page
        page.close()
        context.close()
        browser.close()