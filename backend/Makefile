.PHONY: venv install run test docker-build docker-run docker-stop clean

ifeq ($(OS),Windows_NT)
	PY := .venv/Scripts/python.exe
else
	PY := .venv/bin/python
endif

IMAGE := fruitvision-backend
CONTAINER := fruitvision-backend

# создать виртуальное окружение, если его ещё нет
venv:
	python -m venv .venv

# поставить зависимости для разработки и тестов внутрь venv
install: venv
	$(PY) -m pip install --upgrade pip
	$(PY) -m pip install -r requirements-dev.txt

# запустить бэкенд локально с автоперезагрузкой (без Docker)
run:
	$(PY) -m uvicorn app.main:app --reload --port 8000

# прогнать автотесты pytest
test:
	$(PY) -m pytest -v

# собрать docker-образ; контекст – корень проекта, т.к. в образ нужно скопировать model/artifacts
docker-build:
	docker build -f Dockerfile -t $(IMAGE) ..

# запустить только контейнер бэкенда, отдельно от docker-compose
docker-run: docker-build
	docker run --rm -p 8000:8000 --name $(CONTAINER) $(IMAGE)

# остановить контейнер бэкенда
docker-stop:
	docker stop $(CONTAINER)

# удалить кэши Python
clean:
	rm -rf __pycache__ app/__pycache__ tests/__pycache__ .pytest_cache
