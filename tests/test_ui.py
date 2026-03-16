import pytest
from playwright.sync_api import Page, expect


def test_homepage_loads(page: Page):
    page.goto("http://localhost:3000")
    expect(page).to_have_title("Простой To-Do List")
    expect(page.locator("h1")).to_have_text("Мои задачи")


def test_add_todo(page: Page):
    page.goto("http://localhost:3000")

    input_locator = page.locator("#todo-input")
    input_locator.fill("Позвонить маме")
    page.locator("button[type=submit]").click()

    # Ждём появления задачи в списке
    todo_item = page.locator("li >> text=Позвонить маме")
    expect(todo_item).to_be_visible(timeout=5000)


# def test_load_random_todos(browser_page: Page):
#     page = browser_page
#     page.goto("http://localhost:3000")

#     page.locator("#load-random").click()

#     # Ждём, пока количество li станет больше 0 (или больше начального, если хочешь)
#     expect(page.locator("li")).to_have_count(gte=1, timeout=15000)
#     # ↑ но gte не работает → поэтому используем count() + числовой expect
#     expect(page.locator("li").count()).to_be_greater_than(0)

def test_mark_todo_as_done(page: Page):
    page.goto("http://localhost:3000")

    # Добавляем задачу
    page.locator("#todo-input").fill("Сделать тест")
    page.locator("button[type=submit]").click()

    # Находим checkbox и кликаем
    checkbox = page.locator("input[type=checkbox]").first
    checkbox.check()

    # Проверяем, что li имеет класс done
    li = checkbox.locator("xpath=ancestor::li")
    expect(li).to_have_class("done")
