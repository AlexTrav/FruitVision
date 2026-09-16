.PHONY: up up-d down build logs ps restart clean

# собрать и поднять весь стек в правильном порядке: backend, затем frontend после его healthcheck
# (порядок задан в docker-compose.yml через depends_on: condition: service_healthy)
up:
	docker compose up --build

# то же самое, но в фоновом режиме
up-d:
	docker compose up --build -d

# остановить и удалить контейнеры
down:
	docker compose down

# пересобрать образы без запуска
build:
	docker compose build

# смотреть логи обоих сервисов одновременно
logs:
	docker compose logs -f

# статус контейнеров
ps:
	docker compose ps

# перезапустить весь стек
restart: down up-d

# остановить стек и удалить образы/тома, созданные docker-compose
clean:
	docker compose down --rmi local --volumes
