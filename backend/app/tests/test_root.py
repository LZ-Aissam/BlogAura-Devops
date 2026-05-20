from fastapi.testclient import TestClient
import backend.app.main as main_mod

from backend.app.main import app

client = TestClient(app)


def test_root_db_not_connected(monkeypatch):
    def raise_exc():
        raise Exception("db down")

    monkeypatch.setattr(main_mod, "connect_db", raise_exc)

    response = client.get("/")
    assert response.status_code == 200
    payload = response.json()
    assert "message" in payload
    assert payload.get("db_status") == "not connected"


def test_root_db_connected(monkeypatch):
    def ok():
        return object()

    monkeypatch.setattr(main_mod, "connect_db", ok)

    response = client.get("/")
    assert response.status_code == 200
    payload = response.json()
    assert payload.get("db_status") == "connected"
