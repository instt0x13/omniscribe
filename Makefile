.PHONY: dev prod down logs restart help

# Команды по умолчанию
.DEFAULT_GOAL := help

# Переменные с командами compose
DEV_COMPOSE  = docker compose -f docker-compose.base.yml -f docker-compose.dev.yml
PROD_COMPOSE = docker compose -f docker-compose.base.yml -f docker-compose.prod.yml

## dev	: Запуск окружения для разработки (с Hot Reload)
dev:
	$(DEV_COMPOSE) up --build

## prod	: Запуск окружения для продакшна (в фоновом режиме)
prod:
	$(PROD_COMPOSE) up -d --build

## down	: Остановка и удаление всех контейнеров и сетей
down:
	docker compose -f docker-compose.base.yml -f docker-compose.dev.yml -f docker-compose.prod.yml down

## logs	: Просмотр логов контейнеров в реальном времени (Dev)
logs:
	$(DEV_COMPOSE) logs -f

## restart	: Перезапуск Dev-окружения
restart:
	$(DEV_COMPOSE) restart

## help	: Вывод списка доступных команд
help:
	@echo "Доступные команды:"
	@sed -n 's/^##//p' $(MAKEFILE_LIST)