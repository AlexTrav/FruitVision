.PHONY: install dev build preview docker-build docker-run docker-stop clean

IMAGE := fruitvision-frontend
CONTAINER := fruitvision-frontend

# поставить npm-зависимости
install:
	npm ci

# запустить dev-сервер Vite с горячей перезагрузкой
dev:
	npm run dev

# собрать production-сборку в dist/
build:
	npm run build

# локально просмотреть production-сборку
preview:
	npm run preview

# собрать docker-образ (multi-stage: сборка Vue -> раздача через nginx)
docker-build:
	docker build -t $(IMAGE) .

# запустить только контейнер фронтенда, отдельно от docker-compose
docker-run: docker-build
	docker run --rm -p 8080:80 --name $(CONTAINER) $(IMAGE)

# остановить контейнер фронтенда
docker-stop:
	docker stop $(CONTAINER)

# удалить node_modules и сборку
clean:
	rm -rf node_modules dist
