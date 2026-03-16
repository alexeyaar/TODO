import pytest


def test_get_todos_empty_or_not(api_client, api_base_url):
    response = api_client.get(f"{api_base_url}/todos")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_create_todo(api_client, api_base_url):
    payload = {"text": "Купить молоко"}
    response = api_client.post(f"{api_base_url}/todos", json=payload)
    assert response.status_code == 201
    created = response.json()
    assert created["text"] == "Купить молоко"
    assert created["done"] is False
    assert "id" in created


def test_create_todo_without_text(api_client, api_base_url):
    response = api_client.post(f"{api_base_url}/todos", json={})
    assert response.status_code == 400
    assert "error" in response.json()


def test_toggle_todo(api_client, api_base_url):
    # Сначала создаём
    post_resp = api_client.post(f"{api_base_url}/todos", json={"text": "Тест toggle"})
    todo = post_resp.json()
    todo_id = todo["id"]

    # Toggle → done = True
    patch_resp = api_client.patch(f"{api_base_url}/todos/{todo_id}", json={"done": True})
    assert patch_resp.status_code == 200
    updated = patch_resp.json()
    assert updated["done"] is True

    # Toggle обратно
    patch_resp2 = api_client.patch(f"{api_base_url}/todos/{todo_id}", json={"done": False})
    assert patch_resp2.json()["done"] is False


def test_delete_todo(api_client, api_base_url):
    post_resp = api_client.post(f"{api_base_url}/todos", json={"text": "Удалить меня"})
    todo_id = post_resp.json()["id"]

    del_resp = api_client.delete(f"{api_base_url}/todos/{todo_id}")
    # assert del_resp.status_code == 204

    # Проверяем, что удалено
    get_resp = api_client.get(f"{api_base_url}/todos/{todo_id}")
    assert get_resp.status_code == 404
